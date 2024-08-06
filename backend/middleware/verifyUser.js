const User = require('../models/User');

const verifyUser = async (req, res, next) => {
    const subdomain = req.subdomains[0];
    console.log('Checking verification status for subdomain:', subdomain); // Debug log

    try {
        if (subdomain && subdomain !== 'localhost') {
            const user = await User.findOne({ subdomain: subdomain });

            if (user && user.verified === 1) {
                console.log('User verified:', user); // Debug log
                next();
            } else {
                console.log('User not verified or not found:', user); // Debug log
                res.redirect(302, 'http://localhost:3000/register');
            }
        } else {
            next();
        }
    } catch (error) {
        console.error('Error verifying user:', error); // Debug log
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = verifyUser;
