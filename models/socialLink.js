const mongoose = require("mongoose");

const SocialLinkSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    links: {
      linkedin: { type: String },
      
      twitter: { type: String },
     
      instagram: { type: String },
      facebook: { type: String },
      youtube: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SocialLink", SocialLinkSchema);
