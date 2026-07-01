const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'food',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const commentModel = mongoose.model('comment', commentSchema);

module.exports = commentModel;
