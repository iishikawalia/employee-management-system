const express = require('express');
const { generatePayroll, getPayrolls } = require('../controllers/payrollController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validateMiddleware');

const router = express.Router();

router.route('/')
  .post(
    protect, authorize('admin'),
    [
      body('month').notEmpty(),
      body('userId').notEmpty(),
      validateRequest
    ],
    generatePayroll
  )
  .get(protect, getPayrolls);

module.exports = router;
