// routes/groups.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const groupController = require('../controllers/groupController');

router.post('/create', auth, groupController.createGroup);
router.post('/:id/split-bill', auth, groupController.splitBill);
router.get('/:id', auth, groupController.getGroupDetails);

module.exports = router;