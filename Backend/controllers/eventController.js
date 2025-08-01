// controllers/eventController.js
const Event = require('../models/Event');
const Notification = require('../models/Notification');
const fs = require('fs').promises;

exports.createEvent = async (req, res, next) => {
  try {
    const { title, description, location,date, club } = req.body;
    const media = req.file ? `/uploads/${req.file.filename}` : '';
    const event = new Event({
      title,
      description,
      date,
      location,
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
    const event = await Event.findById(req.params.eventId).populate('club', 'organizers');
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    const userId = req.user._id;

    if (event.attendees.includes(userId)) {
      return res.status(400).json({ message: 'You are already registered for this event.' });
    }

    if (event.capacity && event.attendees.length >= event.capacity) {
      return res.status(400).json({ message: 'Sorry, this event is full.' });
    }
    if (event.eventType === 'Paid') {
      const newTransaction = new Transaction({
        sender: userId,
        receiver: event.creator, 
        amount: event.ticketPrice,
        description: `Ticket for event: ${event.title}`,
        status: 'Completed'
      });
      await newTransaction.save();
    }

    event.attendees.push(userId);
    await event.save();

    await new Notification({
      user: userId,
      message: `You have successfully registered for the event: "${event.title}".`,
      type: 'Event',
      relatedId: event._id
    }).save();

    logger.info(`${req.user.name} registered for event "${event.title}"`);
    res.status(200).json({ message: 'Successfully registered for the event!', event });

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