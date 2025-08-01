// controllers/groupController.js
const mongoose = require('mongoose');
const Group = require('../models/Group');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Message = require('../models/Message');
const Bill = require('../models/Bill');
const logger = require('../utils/logger');

// --- Group Management ---

exports.createGroup = async (req, res, next) => {
  try {
    const { name, participants, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Group name is required.' });
    }

    // Ensure participant IDs are valid ObjectIds
    const participantIds = (participants || []).map(id => new mongoose.Types.ObjectId(id));

    // Add the creator to the participants list if not already included
    const creatorId = req.user._id;
    if (!participantIds.some(id => id.equals(creatorId))) {
      participantIds.push(creatorId);
    }

    // Verify all participants exist in the database
    const validUsers = await User.find({ _id: { $in: participantIds } }).select('_id');
    if (validUsers.length !== participantIds.length) {
      return res.status(404).json({ message: 'One or more participant users could not be found.' });
    }

    const group = new Group({
      name,
      creator: creatorId,
      participants: participantIds.map(userId => ({ user: userId })),
      description,
    });
    await group.save();

    logger.info(`Group "${name}" created by ${req.user.email}`);
    res.status(201).json({ message: 'Group created successfully', group });
  } catch (error) {
    next(error);
  }
};

exports.getGroupDetails = async (req, res, next) => {
    try {
        const group = await Group.findById(req.params.id)
          .populate('creator participants.user', 'name email profilePicture');
        if (!group) return res.status(404).json({ message: 'Group not found' });
        res.json(group);
      } catch (error) {
        next(error);
      }
};

// --- Messaging ---

exports.sendGroupMessage = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const { content } = req.body;
        if (!content) {
          return res.status(400).json({ message: 'Message content is required.' });
        }

        const group = await Group.findById(groupId);
        if (!group) {
          return res.status(404).json({ message: 'Group not found.' });
        }

        const isParticipant = group.participants.some(p => p.user.equals(req.user._id));
        if (!isParticipant) {
          return res.status(403).json({ message: 'Only group members can send messages.' });
        }

        const message = new Message({
          group: groupId,
          sender: req.user._id,
          content,
        });
        await message.save();

        res.status(201).json({ message: 'Message sent successfully', message });
      } catch (error) {
        next(error);
      }
};

exports.splitBill = async (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: 'Request body is missing or empty.',
      error: 'Ensure the client is sending a JSON body with Content-Type: application/json.'
    });
  }

  const { groupId } = req.params;
  const { totalAmount, description, splits } = req.body;

  if (!totalAmount || totalAmount <= 0 || !description) {
    return res.status(400).json({ message: 'Description and a positive total amount are required.' });
  }

  // Conditionally start a session only in production
  const isProduction = process.env.NODE_ENV === 'production';
  const session = isProduction ? await mongoose.startSession() : null;

  try {
    // Start a transaction only if a session exists (i.e., in production)
    if (session) {
      session.startTransaction();
    }

    // Mongoose handles a null session gracefully in the following calls
    const group = await Group.findById(groupId).session(session);
    if (!group) {
      if (session) await session.abortTransaction();
      return res.status(404).json({ message: 'Group not found' });
    }

    const billSplits = [];
    if (splits && splits.length > 0) {
      const customSplitTotal = splits.reduce((sum, split) => sum + split.amount, 0);
      if (Math.abs(customSplitTotal - totalAmount) > 0.01) {
        if (session) await session.abortTransaction();
        return res.status(400).json({ message: 'The sum of custom splits must equal the total amount.' });
      }
      splits.forEach(split => {
        billSplits.push({ user: split.user, amount: split.amount });
      });
    } else {
      const participantCount = group.participants.length;
      if (participantCount === 0) {
        if (session) await session.abortTransaction();
        return res.status(400).json({ message: 'No participants to split the bill with.' });
      }
      const amountPerPerson = totalAmount / participantCount;
      group.participants.forEach(p => {
        billSplits.push({ user: p.user, amount: amountPerPerson });
      });
    }

    const bill = new Bill({
      group: groupId,
      creator: req.user._id,
      description,
      totalAmount,
      splits: billSplits,
    });
    await bill.save({ session });

    const notifications = bill.splits
        .filter(s => !s.user.equals(req.user._id))
        .map(split => ({
            user: split.user,
            message: `${req.user.name} added a new bill "${description}" for ₹${split.amount.toFixed(2)} in group "${group.name}".`,
            type: 'PaymentRequest',
            relatedId: bill._id,
    }));
    if(notifications.length > 0) {
        await Notification.insertMany(notifications, { session });
    }

    // Commit the transaction only if a session exists
    if (session) {
      await session.commitTransaction();
    }

    logger.info(`New bill "${description}" created in group "${group.name}"`);
    res.status(201).json({ message: 'Bill created and split successfully', bill });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
    }
    next(error);
  } finally {
    if (session) {
      session.endSession();
    }
  }
};
exports.settlePayment = async (req, res, next) => {
    const { billId } = req.params;
    const userId = req.user._id;

    const isProduction = process.env.NODE_ENV === 'production';
    const session = isProduction ? await mongoose.startSession() : null;

    try {
        if (session) {
          session.startTransaction();
        }

        // UPDATED: Populate the group name from the bill for the transaction description
        const bill = await Bill.findById(billId)
            .populate('creator', 'name')
            .populate('group', 'name') // <-- This is new
            .session(session);

        if (!bill) {
            if (session) await session.abortTransaction();
            return res.status(404).json({ message: 'Bill not found' });
        }

        const split = bill.splits.find(s => s.user.equals(userId));
        if (!split) {
            if (session) await session.abortTransaction();
            return res.status(403).json({ message: 'You are not part of this bill split.' });
        }
        if (split.paid) {
            if (session) await session.abortTransaction();
            return res.status(400).json({ message: 'You have already settled this payment.' });
        }

        // --- NEW: Create a transaction record for payment history ---
        const newTransaction = new Transaction({
            sender: userId,
            receiver: bill.creator._id, // Payment goes to the person who created the bill
            amount: split.amount,
            description: `Settled bill: "${bill.description}" in group "${bill.group.name}"`,
            status: 'Completed'
        });
        await newTransaction.save({ session });
        // --- End of new code ---

        // Mark the bill as paid
        split.paid = true;
        await bill.save({ session });

        // Notify the bill creator
        if (!bill.creator._id.equals(userId)) {
            const notification = new Notification({
                user: bill.creator._id,
                message: `${req.user.name} paid their share of ₹${split.amount.toFixed(2)} for "${bill.description}".`,
                type: 'PaymentSettled',
                relatedId: bill._id,
            });
            await notification.save({ session });
        }

        if (session) {
          await session.commitTransaction();
        }

        logger.info(`${req.user.name} settled payment for bill "${bill.description}"`);
        res.json({ message: 'Your payment has been successfully settled.', bill });
    } catch (error) {
        if (session) {
          await session.abortTransaction();
        }
        next(error);
    } finally {
        if (session) {
          session.endSession();
        }
    }
};
// --- Combined Group Activity Feed ---

exports.getGroupActivity = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found.' });
        }

        const isParticipant = group.participants.some(p => p.user.equals(req.user._id));
        if (!isParticipant) {
            return res.status(403).json({ message: 'Only group members can view activity.' });
        }

        const [messages, bills] = await Promise.all([
            Message.find({ group: groupId }).populate('sender', 'name profilePicture').lean(),
            Bill.find({ group: groupId }).populate('creator splits.user', 'name profilePicture').lean()
        ]);

        const processedBills = bills.map(bill => {
            const paidCount = bill.splits.filter(s => s.paid).length;
            const totalCount = bill.splits.length;
            return {
                ...bill,
                paymentStatus: `${paidCount}/${totalCount} Paid`
            };
        });

        const activity = [...messages, ...processedBills].sort((a, b) => a.createdAt - b.createdAt);

        res.status(200).json(activity);
    } catch (error) {
        next(error);
    }
};
