const express = require('express');
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validateMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, authorize('admin'), getEmployees)
  .post(
    protect,
    authorize('admin'),
    [
      body('name').notEmpty().withMessage('Name is required'),
      body('email').isEmail().withMessage('Valid email is required'),
      validateRequest
    ],
    createEmployee
  );

router.route('/:id')
  .get(protect, getEmployeeById)
  .put(protect, authorize('admin'), updateEmployee)
  .delete(protect, authorize('admin'), deleteEmployee);

module.exports = router;
