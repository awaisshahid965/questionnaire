const mongoose = require('mongoose');

// Secondary Schema Where We Store Answers

const answerSchema = new mongoose.Schema({
  answer: {
    type: String,
    required: true,
  },
  uname: {
    type: String,
    required: true
  },
  uid: {
    type: String,
    required: true
  }
});

// Main Schema
const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    required: false,
    default: 0
  },
  answers: {
    type: [answerSchema],
    required: false,
    default: []
  }
});

const Question = mongoose.model('question', questionSchema);

module.exports = Question;
