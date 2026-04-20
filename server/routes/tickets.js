const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');

// GET /api/tickets?projectId=xxx&status=&priority=&assignee=&search=
router.get('/', protect, async (req, res) => {
  try {
    const { projectId, status, priority, assignee, search } = req.query;

    if (!projectId) return res.status(400).json({ message: 'projectId is required' });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const query = { project: projectId };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignee) query.assignee = assignee;
    if (search) query.title = { $regex: search, $options: 'i' };

    const tickets = await Ticket.find(query)
      .populate('reporter', 'name email')
      .populate('assignee', 'name email')
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/tickets - create ticket
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, type, priority, status, projectId, assigneeId } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ message: 'Title and projectId are required' });
    }

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // auto ticket number
    const count = await Ticket.countDocuments({ project: projectId });

    const ticket = await Ticket.create({
      title,
      description,
      type: type || 'bug',
      priority: priority || 'medium',
      status: status || 'todo',
      project: projectId,
      reporter: req.user.id,
      assignee: assigneeId || null,
      ticketNumber: count + 1
    });

    await ticket.populate('reporter', 'name email');
    await ticket.populate('assignee', 'name email');

    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/tickets/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('reporter', 'name email')
      .populate('assignee', 'name email')
      .populate('project', 'title key');

    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/tickets/:id - update ticket (status change for kanban drag)
router.put('/:id', protect, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const allowedFields = ['title', 'description', 'type', 'priority', 'status', 'assignee'];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'assignee') {
          ticket.assignee = req.body[field] || null;
        } else {
          ticket[field] = req.body[field];
        }
      }
    });

    await ticket.save();
    await ticket.populate('reporter', 'name email');
    await ticket.populate('assignee', 'name email');

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/tickets/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    if (ticket.reporter.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only reporter can delete this ticket' });
    }

    await ticket.deleteOne();
    res.json({ message: 'Ticket deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
