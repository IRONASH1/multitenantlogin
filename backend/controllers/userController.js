const User = require('../models/User');

const getUserDashboardMessage = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        // Customize the message based on the user or subdomain
        res.json({ message: `Welcome back, ${user.username}!` });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getUserDashboardMessage };
