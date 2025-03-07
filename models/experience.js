const mongoose = require('mongoose');


const experienceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: String,
  position: String,
  startDate: String,
  endDate: String,
  description: String
}, { timestamps: true });

module.exports = mongoose.model('Experience', experienceSchema);
