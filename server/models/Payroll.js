const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  month: { type: String, required: true, index: true },
  baseSalary: { type: Number, required: true },
  deductions: { type: Number, default: 0 },
  bonuses: { type: Number, default: 0 },
  netSalary: { type: Number, required: true },
  generatedAt: { type: Date, default: Date.now }
});

payrollSchema.index({ userId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Payroll', payrollSchema);
