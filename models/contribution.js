const mongoose = require("mongoose");

const ContributionSchema = new mongoose.Schema({
user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
 title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Blog", "Research Paper", "Project", "Design", "Other"],
  },
  external_link: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

const Contribution = mongoose.model("Contribution", ContributionSchema);

module.exports = Contribution;
