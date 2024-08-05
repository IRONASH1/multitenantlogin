// server/routes/api.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust path as needed
const Domain = require('../models/Domain'); // Adjust path as needed

// Register route
router.post('/register', async (req, res) => {
  const { username, password, subdomain } = req.body;

  // Basic validation
  if (!username || !password || !subdomain) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    // Check if subdomain is already in use
    const existingDomain = await Domain.findOne({ name: subdomain });
    if (existingDomain) {
      return res.status(400).json({ success: false, message: 'Subdomain is already in use' });
    }

    // Create a new user
    const newUser = new User({ username, password, subdomain });
    await newUser.save();

    // Optionally, create a new domain record
    const newDomain = new Domain({ name: subdomain, verified: false });
    await newDomain.save();

    res.json({ success: true, message: 'Registration successful' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
