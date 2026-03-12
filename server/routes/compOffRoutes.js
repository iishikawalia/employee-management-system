const express = require('express');
const { applyCompOff, getCompOffs, updateCompOffStatus } = require('../controllers/compOffController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validateMiddleware');

const router = express.Router();

router.route('/')
  .post(
    protect,
    [
      body('date').notEmpty(),
      body('duration').isNumeric(),
      body('reason').notEmpty(),
      validateRequest
    ],
    applyCompOff
  )
  .get(protect, getCompOffs);

router.put('/:id/status', protect, authorize('admin'), updateCompOffStatus);

module.exports = router;
