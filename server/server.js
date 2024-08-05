const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // Import CORS middleware
const User = require('./models/User'); // User model
const verifySubdomain = require('./middleware/verify-subdomain'); // Subdomain verification middleware

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = '1ds4f9e4fwef1we6ce1984'; // Use a strong secret key and store it in env variables

// CORS Configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow localhost and any subdomains of localhost
    if (origin === 'http://localhost:3000' || origin.startsWith('http://') && new URL(origin).hostname.endsWith('localhost')) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
}));

app.use(bodyParser.json());

mongoose.connect('mongodb+srv://graphicsgreenindia:sBKCtckVnAjDwSRY@cluster0.x8spfe1.mongodb.net/subdomain', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected')).catch(err => console.log(err));

// User registration route
app.post('/register', async (req, res) => {
  const { username, email, subdomain, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, subdomain, password: hashedPassword, verified: 0 }); // Default verified to 0
    await user.save();
    res.status(201).send('User registered, please verify your account.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering user');
  }
});

// User login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send('Invalid credentials');
  }
  if (user.verified === 0) {
    return res.status(403).send('Account not verified');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).send('Invalid credentials');
  }
  const token = jwt.sign({ id: user._id, subdomain: user.subdomain }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// User verification route
app.post('/verify-user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    user.verified = 1; // Set to verified
    await user.save();
    res.send('User verified');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error verifying user');
  }
});

// Middleware to verify JWT
const verifyJWT = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).send('Access denied');
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send('Invalid token');
    }
    req.userId = decoded.id;
    req.userSubdomain = decoded.subdomain; // Add subdomain to request
    next();
  });
};

// Apply subdomain verification middleware to specific routes
app.get('/dashboard', verifySubdomain, verifyJWT, (req, res) => {
  // Check if the subdomain in the request matches the user's subdomain
  if (req.userSubdomain !== req.hostname.split('.')[0]) {
    return res.status(403).send('Subdomain mismatch'); // Respond with an error message
  }
  res.send(`Welcome to the dashboard for subdomain: ${req.userSubdomain}`);
});

// Route to verify subdomain
app.get('/api/verify-subdomain/:subdomain', async (req, res) => {
  const { subdomain } = req.params;

  try {
    const user = await User.findOne({ subdomain });
    if (user && user.verified === 1) {
      res.json({ verified: true });
    } else {
      res.json({ verified: false });
    }
  } catch (error) {
    console.error('Error verifying subdomain:', error);
    res.status(500).json({ verified: false });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
