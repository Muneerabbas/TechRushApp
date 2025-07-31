// routes/groups.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const groupController = require('../controllers/groupController');

// --- Group Management ---
router.post('/', auth, groupController.createGroup);
router.get('/:id', auth, groupController.getGroupDetails);

// --- Group Activity (Messages and Bills) ---
router.get('/:groupId/activity', auth, groupController.getGroupActivity);
router.post('/:groupId/messages', auth, groupController.sendGroupMessage);

// --- Bill Splitting & Settlement ---
router.post('/:groupId/split-bill', auth, groupController.splitBill);
router.post('/bills/:billId/settle', auth, groupController.settlePayment);

module.exports = router;
