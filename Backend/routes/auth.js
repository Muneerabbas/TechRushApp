// routes/auth.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');

// --- Multer Configuration for File Uploads ---
// This tells multer where to save the files and how to name them.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    // Create a unique filename to prevent overwriting files with the same name
    cb(null, `user-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// This function filters files to ensure only images are uploaded.
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only image files are allowed!'), false); // Reject the file
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// --- Route Definitions ---

// The `upload.single('profilePicture')` middleware will handle the file upload
// before the authController.register function is called.
router.post('/register', upload.single('profilePicture'), authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me', auth, authController.getProfile);
// Also apply the upload middleware to the profile update route
router.put('/profile', auth, upload.single('profilePicture'), authController.updateProfile);
router.get('/users/:id', auth, authController.getUserProfile);
router.post('/bank-details', auth, authController.addBankDetails);
router.get('/bank-details', auth, authController.getBankDetails);

module.exports = router;
