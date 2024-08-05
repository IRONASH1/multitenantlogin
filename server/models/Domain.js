// server/models/Domain.js
const mongoose = require('mongoose');

const DomainSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  verified: { type: Boolean, default: false }
});

const Domain = mongoose.model('Domain', DomainSchema);
module.exports = Domain;
