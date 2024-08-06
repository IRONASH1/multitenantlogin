const User = require('../models/User'); // Your user model

const checkVerification = async (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret'); // Replace with your JWT secret
        const user = await User.findById(decoded.id);

        if (!user || user.verified !== 1) {
            return res.status(403).json({ message: 'User not verified' });
        }

        req.user = user; // Attach user to request object
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = checkVerification;
