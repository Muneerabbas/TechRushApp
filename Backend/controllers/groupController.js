const Group = require('../models/Group');
const User = require('../models/User');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');

exports.createGroup = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, participants, description } = req.body;
    if (!name) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Group name is required.' });
    }

    let participantIds = [];
    if (participants && Array.isArray(participants) && participants.length > 0) {
      participantIds = participants.map(id => new mongoose.Types.ObjectId(id));
      const validUsers = await User.find({ _id: { $in: participantIds } }).session(session);
      if (validUsers.length !== participants.length) {
        await session.abortTransaction();
        return res.status(404).json({ message: 'One or more participants not found.' });
      }
    }

    // Ensure creator is included in participants if participants are provided
    const creatorId = req.user._id;
    if (participantIds.length > 0 && !participantIds.some(id => id.equals(creatorId))) {
      participantIds.push(creatorId);
    }

    const group = new Group({
      name,
      creator: creatorId,
      participants: participantIds.map(userId => ({ user: userId })),
      description,
    });
    await group.save({ session });

    await session.commitTransaction();
    res.status(201).json({ message: 'Group created successfully', group });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

exports.splitBill = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { totalAmount } = req.body;
    if (!totalAmount || totalAmount < 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'A non-negative total amount is required for bill splitting.' });
    }

    const group = await Group.findById(req.params.id).session(session);
    if (!group) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Group not found' });
    }

    const participantCount = group.participants.length;
    if (participantCount === 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'No participants to split the bill with.' });
    }

    const amountPerPerson = totalAmount / participantCount;
    group.participants = group.participants.map(participant => ({
      ...participant._doc,
      amountOwed: amountPerPerson,
    }));
    group.totalAmount = totalAmount;
    await group.save({ session });

    // Notify participants of the bill split (money request)
    const notifications = group.participants.map(participant => ({
      user: participant.user,
      message: `You owe $${amountPerPerson} for the bill in group ${group.name}`,
      type: 'Payment',
      relatedId: group._id,
    }));
    await Notification.insertMany(notifications, { session });

    await session.commitTransaction();
    res.json({ message: 'Bill split successfully', group });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

exports.getGroupDetails = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('creator participants.user', 'name');
    if (!group) return res.status(404).json({ message: 'Group not found' });
    res.json(group);
  } catch (error) {
    next(error);
  }
};