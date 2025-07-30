// controllers/clubController.js
const Club = require('../models/Club');
const Notification = require('../models/Notification');
const fs = require('fs').promises;

exports.createClub = async (req, res, next) => {
  try {
    const { name, description, members } = req.body;
    const media = req.file ? `/uploads/${req.file.filename}` : '';
    const club = new Club({
      name,
      description,
      creator: req.user.id,
      members,
      media,
    });
    await club.save();

    for (const member of members) {
      const notification = new Notification({
        user: member,
        message: `${req.user.name} added you to club ${name}`,
        type: 'Club',
        relatedId: club._id,
      });
      await notification.save();
    }

    res.status(201).json(club);
  } catch (error) {
    if (req.file) await fs.unlink(req.file.path);
    next(error);
  }
};

exports.addExpense = async (req, res, next) => {
  try {
    const { description, amount } = req.body;
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });
    club.finances.expenses.push({ description, amount });
    club.finances.totalBudget -= amount;
    await club.save();
    res.json(club);
  } catch (error) {
    next(error);
  }
};

exports.getClubDetails = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate('creator members', 'name');
    if (!club) return res.status(404).json({ message: 'Club not found' });
    res.json(club);
  } catch (error) {
    next(error);
  }
};