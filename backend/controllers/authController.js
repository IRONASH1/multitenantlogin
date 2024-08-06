const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { username, email, subdomain, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, subdomain, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Login controller
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (user.password !== password) { // Replace with hashed password check
            return res.status(400).json({ message: 'Invalid password' });
        }

        if (user.verified !== 1) {
            return res.status(403).json({ message: 'User not verified' });
        }

        const token = jwt.sign({ id: user._id }, 'your_jwt_secret'); // Replace with your JWT secret
        res.json({ token });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


module.exports = { register, login };
