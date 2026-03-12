const express = require('express');
const { createTimesheet, getTimesheets, updateTimesheet, deleteTimesheet } = require('../controllers/timesheetController');
const { protect } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validateMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(
    [
      body('project').notEmpty(),
      body('date').notEmpty(),
      body('hours').isNumeric(),
      validateRequest
    ],
    createTimesheet
  )
  .get(getTimesheets);

router.route('/:id')
  .put(updateTimesheet)
  .delete(deleteTimesheet);

module.exports = router;
