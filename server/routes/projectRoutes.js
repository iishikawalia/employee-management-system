const express = require('express');
const { createProject, getProjects, updateProject, deleteProject } = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validateMiddleware');

const router = express.Router();

router.route('/')
  .post(
    protect, authorize('admin'),
    [
      body('projectName').notEmpty().withMessage('Project name is required'),
      validateRequest
    ],
    createProject
  )
  .get(protect, getProjects);

router.route('/:id')
  .put(protect, authorize('admin'), updateProject)
  .delete(protect, authorize('admin'), deleteProject);

module.exports = router;
