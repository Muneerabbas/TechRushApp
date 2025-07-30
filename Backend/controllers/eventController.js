// controllers/eventController.js
const Event = require('../models/Event');
const Notification = require('../models/Notification');
const fs = require('fs').promises;

exports.createEvent = async (req, res, next) => {
  try {
    const { title, description, date, club } = req.body;
    const media = req.file ? `/uploads/${req.file.filename}` : '';
    const event = new Event({
      title,
      description,
      date,
      club,
      creator: req.user.id,
      media,
    });
    await event.save();

    const notification = new Notification({
      user: req.user.id,
      message: `New event ${title} created in club`,
      type: 'Event',
      relatedId: event._id,
    });
    await notification.save();

    res.status(201).json(event);
  } catch (error) {
    if (req.file) await fs.unlink(req.file.path);
    next(error);
  }
};

exports.registerForEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (!event.participants.includes(req.user.id)) {
      event.participants.push(req.user.id);
      await event.save();

      const notification = new Notification({
        user: event.creator,
        message: `${req.user.name} registered for your event ${event.title}`,
        type: 'Event',
        relatedId: event._id,
      });
      await notification.save();
    }
    res.json(event);
  } catch (error) {
    next(error);
  }
};

exports.getEventsForCalendar = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const events = await Event.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    }).populate('club creator', 'name');
    res.json(events);
  } catch (error) {
    next(error);
  }
};

exports.getEventDetails = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('club creator participants', 'name');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    next(error);
  }
};