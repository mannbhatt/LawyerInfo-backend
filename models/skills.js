const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    skills: [{ type: String, required: true }], // Array of skill names
  },
  { timestamps: true }
);

module.exports = mongoose.model("Skill", SkillSchema);
