const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: Date, required: true, index: true },
  checkIn: { type: Date },
  checkOut: { type: Date },
  totalHours: { type: Number, default: 0 },
  status: { type: String, enum: ['present', 'absent', 'half-day'], default: 'present', index: true }
});

attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
