const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const groupController = require('../controllers/groupController');

router.post('/', auth, groupController.createGroup);
router.post('/:id/split-bill', auth, groupController.splitBill);
router.get('/:id', auth, groupController.getGroupDetails);
router.post('/:groupId/messages', auth, groupController.sendGroupMessage);
router.get('/:groupId/messages', auth, groupController.getGroupMessages);

module.exports = router;