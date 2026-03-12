const express = require('express');
const { applyLeave, getLeaves, approveLeave, rejectLeave } = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validateMiddleware');

const router = express.Router();

router.route('/')
  .post(
    protect,
    [
      body('leaveType').notEmpty(),
      body('startDate').notEmpty(),
      body('endDate').notEmpty(),
      body('reason').notEmpty(),
      validateRequest
    ],
    applyLeave
  )
  .get(protect, getLeaves);

router.put('/:id/approve', protect, authorize('admin'), approveLeave);
router.put('/:id/reject', protect, authorize('admin'), rejectLeave);

module.exports = router;
