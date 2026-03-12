const Payroll = require('../models/Payroll');
const User = require('../models/User');
const APIFeatures = require('../utils/apiFeatures');

// @desc    Generate Payroll
// @route   POST /api/payroll/generate
// @access  Private/Admin
const generatePayroll = async (req, res, next) => {
  try {
    const { month, userId } = req.body; // month format: 'YYYY-MM'

    const user = await User.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Check if payroll already exists for this month
    const existingPayroll = await Payroll.findOne({ userId, month });
    if (existingPayroll) {
      res.status(400);
      throw new Error('Payroll already generated for this user for the given month');
    }

    // Use baseSalary directly for simplicity at this stage as defined in requirements
    const baseSalary = user.baseSalary || 0;
    const deductions = req.body.deductions || 0;
    const bonuses = req.body.bonuses || 0;

    const netSalary = baseSalary + bonuses - deductions;

    const payroll = await Payroll.create({
      userId,
      month,
      baseSalary,
      deductions,
      bonuses,
      netSalary
    });

    res.status(201).json({ success: true, data: payroll });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Payrolls
// @route   GET /api/payroll
// @access  Private
const getPayrolls = async (req, res, next) => {
  try {
    let query = Payroll.find();
    if (req.user.role === 'employee') {
      query = query.find({ userId: req.user._id });
    }

    const features = new APIFeatures(query.populate('userId', 'name email'), req.query)
      .filter()
      .sort()
      .paginate();

    const payrolls = await features.query;
    
    let totalQuery = Payroll.find();
    if(req.user.role === 'employee') totalQuery = totalQuery.find({ userId: req.user._id });
    const total = await Payroll.countDocuments(totalQuery);

    res.json({ success: true, count: payrolls.length, total, data: payrolls });
  } catch (error) {
    next(error);
  }
};

module.exports = { generatePayroll, getPayrolls };
