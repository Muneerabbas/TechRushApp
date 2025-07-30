// routes/clubs.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const clubController = require('../controllers/clubController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `club-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage });

router.post('/create', auth, upload.single('media'), clubController.createClub);
router.post('/:id/add-expense', auth, clubController.addExpense);
router.get('/:id', auth, clubController.getClubDetails);

module.exports = router;