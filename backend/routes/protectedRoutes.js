const express = require('express');
const router = express.Router();
const verifyUser = require('../middleware/verifyUser'); // Adjust the path if necessary

// Apply verifyUser middleware to all routes in this file
router.use(verifyUser);

// Example protected route
router.get('/dashboard', (req, res) => {
    res.send('Dashboard');
});

// Add other protected routes here
router.get('/profile', (req, res) => {
    res.send('Profile');
});

// Add any additional routes that require user verification
// Example: router.get('/settings', (req, res) => { res.send('Settings'); });

module.exports = router;
