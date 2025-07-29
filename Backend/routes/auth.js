const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Handles POST requests to /api/auth/register
router.post('/register', register);

// Handles POST requests to /api/auth/login
router.post('/login', login);

module.exports = router;