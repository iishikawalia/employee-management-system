const mongoose = require('mongoose');

const timesheetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  module: { type: String },
  phase: { type: String },
  date: { type: Date, required: true, index: true },
  hours: { type: Number, required: true },
  comment: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true }
});

module.exports = mongoose.model('Timesheet', timesheetSchema);
