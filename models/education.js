const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String },
    grade: { type: String },
    description: { type: String, required: true },
  },
  { timestamps: true } 
);

module.exports = mongoose.model("Education", EducationSchema);
