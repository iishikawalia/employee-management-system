const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  leaveType: { type: String, enum: ['sick', 'casual', 'earned'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
  adminComment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
