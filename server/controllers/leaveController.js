const LeaveRequest = require('../models/LeaveRequest');
const APIFeatures = require('../utils/apiFeatures');

// @desc    Apply for leave
// @route   POST /api/leaves
// @access  Private/Employee
const applyLeave = async (req, res, next) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    const leaveRequest = await LeaveRequest.create({
      userId: req.user._id,
      leaveType,
      startDate,
      endDate,
      reason,
      status: 'pending'
    });

    res.status(201).json({ success: true, data: leaveRequest });
  } catch (error) {
    next(error);
  }
};

// @desc    Get leaves
// @route   GET /api/leaves
// @access  Private
const getLeaves = async (req, res, next) => {
  try {
    let query = LeaveRequest.find();
    if (req.user.role === 'employee') {
      query = query.find({ userId: req.user._id });
    }

    const features = new APIFeatures(query.populate('userId', 'name email'), req.query)
      .filter()
      .sort()
      .paginate();

    const leaves = await features.query;
    
    let totalQuery = LeaveRequest.find();
    if(req.user.role === 'employee') totalQuery = totalQuery.find({ userId: req.user._id });
    const total = await LeaveRequest.countDocuments(totalQuery);

    res.json({
      success: true,
      count: leaves.length,
      total,
      data: leaves,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve Leave
// @route   PUT /api/leaves/:id/approve
// @access  Private/Admin
const approveLeave = async (req, res, next) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id);

    if (!leave) {
      res.status(404);
      throw new Error('Leave request not found');
    }

    leave.status = 'approved';
    leave.adminComment = req.body.adminComment || '';
    await leave.save();

    res.json({ success: true, data: leave });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject Leave
// @route   PUT /api/leaves/:id/reject
// @access  Private/Admin
const rejectLeave = async (req, res, next) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id);

    if (!leave) {
      res.status(404);
      throw new Error('Leave request not found');
    }

    leave.status = 'rejected';
    leave.adminComment = req.body.adminComment || '';
    await leave.save();

    res.json({ success: true, data: leave });
  } catch (error) {
    next(error);
  }
};

module.exports = { applyLeave, getLeaves, approveLeave, rejectLeave };
