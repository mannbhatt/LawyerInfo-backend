const mongoose = require("mongoose");

const AboutSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    summary: { type: String, required: true },
    highlights: [{ type: String }],
    hobbies: [{ type: String }],
    personal_website: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("About", AboutSchema);
