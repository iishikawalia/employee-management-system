const CompOff = require('../models/CompOff');
const APIFeatures = require('../utils/apiFeatures');

// @desc    Apply for CompOff
// @route   POST /api/compoff
// @access  Private/Employee
const applyCompOff = async (req, res, next) => {
  try {
    const { date, duration, reason } = req.body;

    const compOff = await CompOff.create({
      userId: req.user._id,
      date,
      duration,
      reason,
      status: 'pending'
    });

    res.status(201).json({ success: true, data: compOff });
  } catch (error) {
    next(error);
  }
};

// @desc    Get CompOffs
// @route   GET /api/compoff
// @access  Private
const getCompOffs = async (req, res, next) => {
  try {
    let query = CompOff.find();
    if (req.user.role === 'employee') {
      query = query.find({ userId: req.user._id });
    }

    const features = new APIFeatures(query.populate('userId', 'name email'), req.query)
      .filter()
      .sort()
      .paginate();

    const compOffs = await features.query;
    
    let totalQuery = CompOff.find();
    if(req.user.role === 'employee') totalQuery = totalQuery.find({ userId: req.user._id });
    const total = await CompOff.countDocuments(totalQuery);

    res.json({ success: true, count: compOffs.length, total, data: compOffs });
  } catch (error) {
    next(error);
  }
};

// @desc    Update CompOff Status
// @route   PUT /api/compoff/:id/status
// @access  Private/Admin
const updateCompOffStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const compOff = await CompOff.findById(req.params.id);

    if (!compOff) {
      res.status(404);
      throw new Error('CompOff request not found');
    }

    compOff.status = status;
    await compOff.save();

    res.json({ success: true, data: compOff });
  } catch (error) {
    next(error);
  }
};

module.exports = { applyCompOff, getCompOffs, updateCompOffStatus };
