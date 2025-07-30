// controllers/groupController.js
const Group = require('../models/Group');
const Notification = require('../models/Notification');

exports.createGroup = async (req, res, next) => {
  try {
    const { name, participants, totalAmount, description } = req.body;
    const group = new Group({
      name,
      creator: req.user.id,
      participants: participants.map(userId => ({ user: userId })),
      totalAmount,
      description,
    });
    await group.save();

    for (const participant of participants) {
      const notification = new Notification({
        user: participant,
        message: `${req.user.name} added you to group ${name}`,
        type: 'Group',
        relatedId: group._id,
      });
      await notification.save();
    }

    res.status(201).json(group);
  } catch (error) {
    next(error);
  }
};

exports.splitBill = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    const amountPerPerson = group.totalAmount / group.participants.length;
    group.participants = group.participants.map(participant => ({
      ...participant._doc,
      amountOwed: amountPerPerson,
    }));
    await group.save();

    for (const participant of group.participants) {
      const notification = new Notification({
        user: participant.user,
        message: `You owe ${amountPerPerson} for group ${group.name}`,
        type: 'Group',
        relatedId: group._id,
      });
      await notification.save();
    }

    res.json(group);
  } catch (error) {
    next(error);
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