const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');

// All auth-related routes are prefixed with /auth
router.use('/auth', authRoutes);

// You can add other route files here later, e.g., for transactions
// router.use('/transactions', require('./transactions'));

module.exports = router;