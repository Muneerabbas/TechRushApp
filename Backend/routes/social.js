// routes/social.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const socialController = require('../controllers/socialController');

router.post('/share', auth, socialController.shareActivity);
router.get('/community', auth, socialController.getCommunityActivity);

module.exports = router;