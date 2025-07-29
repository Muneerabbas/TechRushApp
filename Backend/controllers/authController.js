// controllers/authController.js

const User = require('../models/User');
const BankDetails = require('../models/BankDetails');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');

// --- User Registration (with Photo) ---
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, description } = req.body;

    if (!name || !email || !password) {
      // If validation fails after a file was uploaded, delete the orphaned file.
      if (req.file) await fs.unlink(req.file.path);
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    let user = await User.findOne({ email });
    if (user) {
      if (req.file) await fs.unlink(req.file.path);
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Check if a file was uploaded and set the path
    const profilePicture = req.file ? `/uploads/${req.file.filename}` : '';

    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'Student',
      description: description || '',
      profilePicture: profilePicture, // Save the path to the database
    });

    await user.save();
    
    // We don't want to send the password back, even the hashed one.
    user.password = undefined;

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, user });
  } catch (error) {
    if (req.file) await fs.unlink(req.file.path).catch(err => console.error("Error deleting file on failure:", err));
    next(error);
  }
};

// --- Update Profile (with Photo) ---
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      if (req.file) await fs.unlink(req.file.path);
      return res.status(404).json({ message: 'User not found' });
    }

    // Update text fields if provided
    if (name) user.name = name;
    if (description) user.description = description;

    // Check for a new profile picture
    if (req.file) {
      // If an old picture exists, delete it from the server
      if (user.profilePicture) {
        const oldPath = path.join(__dirname, '..', user.profilePicture);
        await fs.unlink(oldPath).catch(err => console.log("Old profile picture not found, continuing..."));
      }
      // Set the new picture path
      user.profilePicture = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    if (req.file) await fs.unlink(req.file.path).catch(err => console.error("Error deleting file on failure:", err));
    next(error);
  }
};

// --- Other Functions (Unchanged but included for completeness) ---

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Please provide email and password' });

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    user.password = undefined;
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    // req.user is attached by the auth middleware
    res.json(req.user);
  } catch (error) {
    next(error);
  }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('name role description profilePicture');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.addBankDetails = async (req, res, next) => { /* ... unchanged ... */ };
exports.getBankDetails = async (req, res, next) => { /* ... unchanged ... */ };
