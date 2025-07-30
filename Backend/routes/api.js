const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const transactionRoutes = require('./transactions');

router.use('/auth', authRoutes);
router.use('/transactions', transactionRoutes);

module.exports = router;