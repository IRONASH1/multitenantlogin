const express = require('express');
const router = express.Router();
const verifyUser = require('../middleware/verifyUser'); // Adjust the path if necessary
const protectedRoutes = require('./protectedRoutes'); // Adjust the path if necessary

// Apply verifyUser middleware to all API routes
router.use('/api', verifyUser, protectedRoutes);

module.exports = router;
