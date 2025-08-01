const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const transactionRoutes = require('./transactions');
const notificationRoutes = require('./notifications');
const groupRoutes = require('./groups');
const eventRouter = require('./events')
const clubRoutes = require('./club');
router.use('/auth', authRoutes);
router.use('/transactions', transactionRoutes);
router.use('/notifications', notificationRoutes);
router.use('/groups', groupRoutes);
router.use('/clubs', clubRoutes);
router.use('/events',eventRouter);
module.exports = router;