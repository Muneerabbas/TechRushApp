// routes/club.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const clubController = require('../controllers/clubController');

// @route   POST api/clubs
// @desc    Create a new club
// @access  Admin
router.post(
    '/',
    auth,
    role(['Admin']),
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


module.exports = router;
