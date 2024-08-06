const express = require('express');
const router = express.Router();

// Example route to fetch a welcome message from the database
router.get('/welcome/:subdomain', async (req, res) => {
    const { subdomain } = req.params;

    // Fetch the message from the database based on the subdomain
    // Replace this with your actual database query
    const message = await getWelcomeMessageFromDatabase(subdomain); 

    if (message) {
        res.json({ message });
    } else {
        res.status(404).json({ message: 'Welcome message not found' });
    }
});

async function getWelcomeMessageFromDatabase(subdomain) {
    // Implement database query to fetch the welcome message
    // For example purposes, return a static message
    if (subdomain === 'localhost') {
        return 'Welcome to the login portal';
    }
    return `Welcome to the login portal, ${subdomain}`;
}

module.exports = router;
