const User = require('../models/User');
const APIFeatures = require('../utils/apiFeatures');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private/Admin
const getEmployees = async (req, res, next) => {
  try {
    const features = new APIFeatures(User.find({ role: 'employee' }).select('-password'), req.query)
      .filter()
      .search(['name', 'email', 'department', 'position'])
      .sort()
      .paginate();

    const employees = await features.query;
    const total = await User.countDocuments({ role: 'employee' });

    res.json({
      success: true,
      count: employees.length,
      total,
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private
const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await User.findById(req.params.id).select('-password');

    if (employee) {
      res.json({ success: true, data: employee });
    } else {
      res.status(404);
      throw new Error('Employee not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create new employee
// @route   POST /api/employees
// @access  Private/Admin
const createEmployee = async (req, res, next) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      res.status(400);
      throw new Error('Employee with this email already exists');
    }
    
    // Default password to email if not provided
    const employeeData = { ...req.body, role: 'employee' };
    if(!employeeData.password) employeeData.password = employeeData.email;

    const employee = await User.create(employeeData);
    const createdEmployee = await User.findById(employee._id).select('-password');

    res.status(201).json({ success: true, data: createdEmployee });
  } catch (error) {
    next(error);
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private/Admin
const updateEmployee = async (req, res, next) => {
  try {
    const employee = await User.findById(req.params.id);

    if (employee) {
      // Don't update password through this route
      delete req.body.password;
      
      const updatedEmployee = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).select('-password');

      res.json({ success: true, data: updatedEmployee });
    } else {
      res.status(404);
      throw new Error('Employee not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private/Admin
const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await User.findById(req.params.id);

    if (employee) {
      await employee.deleteOne();
      res.json({ success: true, message: 'Employee removed' });
    } else {
      res.status(404);
      throw new Error('Employee not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
