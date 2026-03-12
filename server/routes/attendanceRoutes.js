const express = require('express');
const { checkIn, checkOut, getAttendances } = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/check-in', checkIn);
router.put('/check-out', checkOut);
router.get('/', getAttendances);

module.exports = router;
