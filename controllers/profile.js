const Profile = require("../models/profile");

const createProfile = async (req, res) => {
  const { userId, fullName, email, phone, bio } = req.body;

  const newProfile = new Profile({
    userId,
    fullName,
    email,
    phone,
    bio,
  });

  await newProfile.save();
  res.status(201).json({ message: "Profile created successfully" });
};

module.exports = { createProfile };
