// controllers/searchController.js
const User = require('../models/User');
const Group = require('../models/Group');
const Club = require('../models/Club');
const Event = require('../models/Event');

exports.search = async (req, res, next) => {
  try {
    const { query } = req.query;
    const regex = new RegExp(query, 'i');

    const users = await User.find({ name: regex }).select('name profilePicture');
    const groups = await Group.find({ name: regex }).select('name');
    const clubs = await Club.find({ name: regex }).select('name');
    const events = await Event.find({ title: regex }).select('title');

    res.json({ users, groups, clubs, events });
  } catch (error) {
    next(error);
  }
};