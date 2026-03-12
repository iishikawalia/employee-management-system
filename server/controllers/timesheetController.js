const Timesheet = require('../models/Timesheet');
const APIFeatures = require('../utils/apiFeatures');

// @desc    Create timesheet entry
// @route   POST /api/timesheets
// @access  Private/Employee
const createTimesheet = async (req, res, next) => {
  try {
    const { project, module, phase, date, hours, comment } = req.body;

    const timesheet = await Timesheet.create({
      userId: req.user._id,
      project,
      module,
      phase,
      date,
      hours,
      comment,
      status: 'pending'
    });

    res.status(201).json({ success: true, data: timesheet });
  } catch (error) {
    next(error);
  }
};

// @desc    Get timesheets
// @route   GET /api/timesheets
// @access  Private
const getTimesheets = async (req, res, next) => {
  try {
    let query = Timesheet.find();
    if (req.user.role === 'employee') {
      query = query.find({ userId: req.user._id });
    }

    const features = new APIFeatures(query.populate('userId', 'name email').populate('project', 'projectName'), req.query)
      .filter()
      .sort()
      .paginate();

    const timesheets = await features.query;
    
    let totalQuery = Timesheet.find();
    if(req.user.role === 'employee') totalQuery = totalQuery.find({ userId: req.user._id });
    const total = await Timesheet.countDocuments(totalQuery);

    res.json({ success: true, count: timesheets.length, total, data: timesheets });
  } catch (error) {
    next(error);
  }
};

// @desc    Update timesheet
// @route   PUT /api/timesheets/:id
// @access  Private
const updateTimesheet = async (req, res, next) => {
  try {
    const timesheet = await Timesheet.findById(req.params.id);

    if (!timesheet) {
      res.status(404);
      throw new Error('Timesheet entry not found');
    }

    // Role check
    if (req.user.role === 'employee' && timesheet.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this timesheet');
    }

    // Only admin can update status directly from 'pending'
    if (req.body.status && req.user.role !== 'admin') {
      delete req.body.status;
    }

    const updatedTimesheet = await Timesheet.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.json({ success: true, data: updatedTimesheet });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete timesheet
// @route   DELETE /api/timesheets/:id
// @access  Private/Employee
const deleteTimesheet = async (req, res, next) => {
  try {
    const timesheet = await Timesheet.findById(req.params.id);

    if (!timesheet) {
      res.status(404);
      throw new Error('Timesheet entry not found');
    }

    if (timesheet.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to delete this timesheet');
    }

    await timesheet.deleteOne();
    res.json({ success: true, message: 'Timesheet removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTimesheet, getTimesheets, updateTimesheet, deleteTimesheet };
