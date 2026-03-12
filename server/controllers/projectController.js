const Project = require('../models/Project');
const APIFeatures = require('../utils/apiFeatures');

// @desc    Create project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    const features = new APIFeatures(Project.find().populate('assignedEmployees', 'name email'), req.query)
      .filter()
      .search(['projectName', 'description', 'moduleName'])
      .sort()
      .paginate();

    const projects = await features.query;
    const total = await Project.countDocuments();

    res.json({ success: true, count: projects.length, total, data: projects });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    await project.deleteOne();
    res.json({ success: true, message: 'Project removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createProject, getProjects, updateProject, deleteProject };
