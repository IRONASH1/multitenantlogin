// middleware/verify-subdomain.js
const User = require('../models/User');

const verifySubdomain = async (req, res, next) => {
  const host = req.hostname;
  const subdomain = host.split('.')[0];
  
  console.log('Host:', host);
  console.log('Subdomain:', subdomain);

  if (subdomain === 'localhost' || subdomain === 'www') {
    console.log('Allowed subdomain (localhost or www)');
    return next();
  }

  try {
    const user = await User.findOne({ subdomain });
    if (user && user.verified === 1) {
      console.log('Subdomain verified:', subdomain);
      return next();
    } else {
      console.log('Subdomain not verified or not found');
      return res.status(403).send('Subdomain not verified');
    }
  } catch (error) {
    console.error('Error verifying subdomain:', error);
    return res.status(500).send('Internal server error');
  }
};

module.exports = verifySubdomain;
