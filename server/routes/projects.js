const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// GET /api/projects - list all projects for current user
router.get('/', protect, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user.id }, { members: req.user.id }]
    })
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/projects - create new project
router.post('/', protect, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) return res.status(400).json({ message: 'Project title is required' });

    const project = await Project.create({
      title,
      description,
      owner: req.user.id,
      members: [req.user.id]
    });

    await project.populate('owner', 'name email');
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/projects/:id - single project
router.get('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members', 'name email');

    if (!project) return res.status(404).json({ message: 'Project not found' });

    const isMember = project.members.some(m => m._id.toString() === req.user.id) ||
      project.owner._id.toString() === req.user.id;

    if (!isMember) return res.status(403).json({ message: 'Access denied' });

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/projects/:id - update project
router.put('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only project owner can update' });
    }

    const { title, description } = req.body;
    project.title = title || project.title;
    project.description = description !== undefined ? description : project.description;
    await project.save();

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/projects/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only owner can delete this project' });
    }

    await project.deleteOne();
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/projects/:id/members - add member by email
router.post('/:id/members', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only owner can add members' });
    }

    const { email } = req.body;
    const userToAdd = await User.findOne({ email });
    if (!userToAdd) return res.status(404).json({ message: 'User not found' });

    const alreadyMember = project.members.includes(userToAdd._id.toString());
    if (alreadyMember) return res.status(400).json({ message: 'User already a member' });

    project.members.push(userToAdd._id);
    await project.save();
    await project.populate('members', 'name email');

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
