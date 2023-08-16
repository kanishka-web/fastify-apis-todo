const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  dateOfCreation: { type: Date, default: Date.now },
  dateOfCompletion: Date,
  createdBy: String,
});

// Pre-save middleware to generate ObjectId for 'id' field
todoSchema.pre('save', function (next) {
  if (!this.id) {
    this.id = mongoose.Types.ObjectId();
  }
  next();
});

module.exports = mongoose.model('Todo', todoSchema);
