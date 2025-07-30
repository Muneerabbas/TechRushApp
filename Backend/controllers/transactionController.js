const Transaction = require('../models/Transaction');
const User = require('../models/User');

exports.sendPayment = async (req, res, next) => {
  try {
    console.log('Request body:', req.body); // Debug log
    const { receiverId, amount, description } = req.body;
    if (!receiverId || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Receiver ID and a positive amount are required.' });
    }
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found.' });
    }
    if (req.user._id.toString() === receiverId) {
      return res.status(400).json({ message: 'Cannot send payment to yourself.' });
    }
    const transaction = new Transaction({
      sender: req.user._id,
      receiver: receiverId,
      amount,
      description,
      status: 'Completed',
    });
    await transaction.save();
    res.status(201).json({ message: 'Payment sent successfully', transaction });
  } catch (error) {
    next(error);
  }
};

exports.requestPayment = async (req, res, next) => {
  try {
    console.log('Request body:', req.body); // Debug log
    const { receiverId, amount, description } = req.body;
    if (!receiverId || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Receiver ID and a positive amount are required.' });
    }
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found.' });
    }
    if (req.user._id.toString() === receiverId) {
      return res.status(400).json({ message: 'Cannot request payment from yourself.' });
    }
    const transaction = new Transaction({
      sender: req.user._id,
      receiver: receiverId,
      amount,
      description,
      status: 'Pending',
    });
    await transaction.save();
    res.status(201).json({ message: 'Payment request sent successfully', transaction });
  } catch (error) {
    next(error);
  }
};