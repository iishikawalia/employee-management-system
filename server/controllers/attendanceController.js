const Attendance = require('../models/Attendance');
const APIFeatures = require('../utils/apiFeatures');

// @desc    Check In
// @route   POST /api/attendance/check-in
// @access  Private
const checkIn = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({
      userId: req.user._id,
      date: { $gte: today }
    });

    if (attendance && attendance.checkIn) {
      res.status(400);
      throw new Error('Already checked in today');
    }

    attendance = await Attendance.create({
      userId: req.user._id,
      date: new Date(),
      checkIn: new Date(),
      status: 'present'
    });

    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    next(error);
  }
};

// @desc    Check Out
// @route   PUT /api/attendance/check-out
// @access  Private
const checkOut = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      userId: req.user._id,
      date: { $gte: today }
    });

    if (!attendance || !attendance.checkIn) {
      res.status(400);
      throw new Error('Have not checked in today');
    }
    if (attendance.checkOut) {
      res.status(400);
      throw new Error('Already checked out today');
    }

    attendance.checkOut = new Date();
    
    // Calculate total hours
    const diff = attendance.checkOut.getTime() - attendance.checkIn.getTime();
    attendance.totalHours = diff / (1000 * 60 * 60);

    await attendance.save();

    res.json({ success: true, data: attendance });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all attendance records
// @route   GET /api/attendance
// @access  Private
const getAttendances = async (req, res, next) => {
  try {
    let query = Attendance.find();
    if (req.user.role === 'employee') {
      query = query.find({ userId: req.user._id });
    }

    const features = new APIFeatures(query.populate('userId', 'name email'), req.query)
      .filter()
      .sort()
      .paginate();

    const attendances = await features.query;

    let totalQuery = Attendance.find();
    if(req.user.role === 'employee') totalQuery = totalQuery.find({ userId: req.user._id });
    const total = await Attendance.countDocuments(totalQuery);

    res.json({
      success: true,
      count: attendances.length,
      total,
      data: attendances,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { checkIn, checkOut, getAttendances };
