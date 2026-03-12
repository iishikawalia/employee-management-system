const express = require('express');
const { loginUser, registerUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validateMiddleware');

const router = express.Router();

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required'),
    validateRequest
  ],
  loginUser
);

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be 6 or more characters'),
    validateRequest
  ],
  registerUser
);

router.get('/me', protect, getUserProfile);

module.exports = router;
