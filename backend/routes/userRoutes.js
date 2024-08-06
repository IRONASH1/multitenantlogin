const express = require('express');
const { getUserDashboardMessage } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/dashboard', authMiddleware, getUserDashboardMessage);

module.exports = router;
