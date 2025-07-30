// controllers/socialController.js
const Notification = require('../models/Notification');

exports.shareActivity = async (req, res, next) => {
  try {
    const { message } = req.body;
    const notification = new Notification({
      user: req.user.id,
      message: `${req.user.name} shared: ${message}`,
      type: 'General',
    });
    await notification.save();
    res.status(201).json({ message: 'Activity shared' });
  } catch (error) {
    next(error);
  }
};

exports.getCommunityActivity = async (req, res, next) => {
  try {
    const activities = await Notification.find({ type: 'General' })
      .populate('user', 'name');
    res.json(activities);
  } catch (error) {
    next(error);
  }
};