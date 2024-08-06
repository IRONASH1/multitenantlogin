const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Import bcrypt
const jwt = require('jsonwebtoken'); // Import jwt if you are using it
const verifyUser = require('../middleware/verifyUser'); // Adjust the path if necessary

router.use('/protected-route', verifyUser, (req, res) => {
    res.json({ message: 'This is a protected route' });
});
// Endpoint to check if a user with a given subdomain is verified
router.get('/verify/:subdomain', async (req, res) => {
    const { subdomain } = req.params;
    console.log('Checking verification status for subdomain:', subdomain); // Debug log

    try {
        // Check if a subdomain is present
        if (subdomain && subdomain !== 'localhost') {
            // Verify the subdomain in the database with an exact match
            const user = await User.findOne({ subdomain: subdomain });

            if (user && user.verified === 1) {
                console.log('User verified:', user); // Debug log
                res.status(200).json({ verified: true });
            } else {
                console.log('User not verified or not found', user); // Debug log
                res.status(401).json({ verified: false });
            }
        } else {
            // If there is no subdomain or it's 'localhost', proceed without verification
            res.status(200).json({ verified: true });
        }
    } catch (error) {
        console.error('Error verifying user:', error); // Debug log
        res.status(500).json({ error: 'Server error' });
    }
});
// Register endpoint
router.post('/register', async (req, res) => {
    const { username, email, subdomain, password } = req.body;
    
    try {
        // Create and save a new user
        const newUser = new User({ username, email, subdomain, password, verified: 0 });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
