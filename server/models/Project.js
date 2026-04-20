const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  key: {
    type: String,
    uppercase: true,
    trim: true
  }
}, { timestamps: true });

// auto-generate project key from title
projectSchema.pre('save', function (next) {
  if (this.isNew && !this.key) {
    this.key = this.title.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema);
