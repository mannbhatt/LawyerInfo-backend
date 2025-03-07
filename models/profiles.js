const mongoose = require('mongoose');


const profileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    email: { type: String, unique: true, required:true},  
fullName: { type: String, required: false,default:"N/A"},
  phone: { type: String, required: false, default: "N/A" },
  dateOfBirth: { type: Date, required: false, default: "1999-01-01" },
  gender: { type: String, required: false, enum: ["Male", "Female", "Other"], default: "Male" },
  profileImage: { type: String, default: "N/A" },
   imageKey: { type: String, default: "N/A" },
  bio: { type: String, default: "N/A" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});


profileSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Profile', profileSchema);
