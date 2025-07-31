// routes/club.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role'); // Make sure this middleware is required
const clubController = require('../controllers/clubController');
const multer = require('multer');
const path = require('path');

// --- Multer Configuration for Club Cover Image Uploads ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure 'uploads' directory exists
  },
  filename: (req, file, cb) => {
    // Create a unique filename for the club cover image
    cb(null, `club-cover-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });


// @route   POST api/clubs
// @desc    Create a new club (with optional cover image)
// @access  Admin Only
router.post(
    '/',
    auth, 
    role(['Admin']), 
    upload.single('coverImage'), 
    clubController.createClub
);

// @route   GET api/clubs
// @desc    Get all clubs
// @access  Authenticated Users
router.get('/', auth, clubController.getAllClubs);

// @route   GET api/clubs/:clubId
// @desc    Get details for a single club
// @access  Authenticated Users
router.get('/:clubId', auth, clubController.getClubDetails);

// @route   POST api/clubs/:clubId/join
// @desc    Request to join a club
// @access  Authenticated Users (Students)
router.post('/:clubId/join', auth, clubController.requestToJoinClub);

// @route   POST api/clubs/:clubId/manage-request
// @desc    Approve or deny a join request
// @access  Club Organizers
router.post('/:clubId/manage-request', auth, clubController.manageJoinRequest);

// @route   POST api/clubs/:clubId/organizers
// @desc    Add a new organizer to the club
// @access  Existing Club Organizers
router.post('/:clubId/organizers', auth, clubController.addOrganizer);


module.exports = router;
