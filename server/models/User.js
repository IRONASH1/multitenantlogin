// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  subdomain: { type: String, required: true },
  password: { type: String, required: true },
  verified: { type: Number, default: 0 } // Default value is 0 (not verified)
});

const User = mongoose.model('User', userSchema);
module.exports = User;
