const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const { protect } = require('../middleware/auth');

// GET /api/comments?ticketId=xxx
router.get('/', protect, async (req, res) => {
  try {
    const { ticketId } = req.query;
    if (!ticketId) return res.status(400).json({ message: 'ticketId is required' });

    const comments = await Comment.find({ ticket: ticketId })
      .populate('author', 'name email')
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/comments
router.post('/', protect, async (req, res) => {
  try {
    const { ticketId, text } = req.body;

    if (!ticketId || !text) {
      return res.status(400).json({ message: 'ticketId and text are required' });
    }

    const comment = await Comment.create({
      ticket: ticketId,
      author: req.user.id,
      text
    });

    await comment.populate('author', 'name email');
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/comments/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
