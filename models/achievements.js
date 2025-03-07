const mongoose = require("mongoose");

const Achievements = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    certificate_name: { type: String, required: true },
    issuing_organization: { type: String, required: true },
    issue_date: { type: Date, required: true },
    credential_url: { type: String }, // URL to verify the certificate
    certificate_image: { type: String }, // URL of the certificate image
    imageKey: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Achievements", Achievements);
