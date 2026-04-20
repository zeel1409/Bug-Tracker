const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Ticket title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['bug', 'feature', 'task', 'improvement'],
    default: 'bug'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['todo', 'inprogress', 'done'],
    default: 'todo'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  ticketNumber: {
    type: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
