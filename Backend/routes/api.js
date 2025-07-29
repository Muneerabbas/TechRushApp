const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
// Add other routes (e.g., payments, groups, events) as needed
router.use('/auth', authRoutes);

module.exports = router;