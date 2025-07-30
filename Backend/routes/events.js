// routes/events.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const eventController = require('../controllers/eventController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `event-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage });

router.post('/create', auth, upload.single('media'), eventController.createEvent);
router.post('/:id/register', auth, eventController.registerForEvent);
router.get('/calendar', auth, eventController.getEventsForCalendar);
router.get('/:id', auth, eventController.getEventDetails);

module.exports = router;