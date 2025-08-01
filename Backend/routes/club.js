// routes/club.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const clubController = require('../controllers/clubController');
const multer = require('multer');
const path = require('path');

// --- Multer Configuration ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `club-cover-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage: storage });

// Create a Club (Admin Only)
router.post(
    '/',
    auth, 
    role(['Admin']),
    upload.single('coverImage'), 
    clubController.createClub
);

// Add an Organizer
router.post('/:clubId/organizers', auth, clubController.addOrganizer);

// Get All Clubs
router.get('/', clubController.getAllClubs);

// Get Club Details
router.get('/:clubId', clubController.getClubDetails);

// Request to Join a Club
router.post('/:clubId/join', auth, clubController.requestToJoinClub);

// Manage a Join Request
router.post('/:clubId/manage-request', auth, clubController.manageJoinRequest);

// Pay Membership Fee
router.post('/:clubId/pay-dues', auth, clubController.payMembershipFee);


module.exports = router;
