const mongoose = require('mongoose');

const compOffSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: Date, required: true, index: true },
  duration: { type: Number, required: true }, // in hours
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true }
});

module.exports = mongoose.model('CompOff', compOffSchema);
