const { Hono } = require("hono");
const Profile = require("../models/profiles");
const User = require("../models/user");
const Education = require('../models/education');
const Experience = require('../models/experience');
const About = require('../models/about');
const Achievements = require('../models/achievements');
const Contribution = require('../models/contribution');
const Skills = require('../models/skills');
const SocialLink = require('../models/socialLink');

const profiledataRoute = new Hono();

profiledataRoute.get("/:user_id", async (c) => {
  try {
    const { user_id } = c.req.param(); // Get user_id from URL params

    // Fetch the user profile
    const profile = await Profile.findOne({ userId: user_id });


    // Fetch the user details from User collection (username, email, etc.)
    const user = await User.findById(user_id).select("username profileImage email");
    if (!user) return c.json({ success: false, error: "User not found" }, 404);

    // Fetch related data from other collections
    const educationRecords = await Education.find({ userId: user_id });
    const experienceRecords = await Experience.find({ userId: user_id });
    const about = await About.findOne({ user_id: user_id });
    const achievements = await Achievements.find({ user_id: user_id });
    const contributions = await Contribution.find({ user_id: user_id });
    const skills = await Skills.findOne({ user_id: user_id });
    const socialLinks = await SocialLink.findOne({ user_id: user_id });

    // Combine all data into a single response object
    const responseData = {
      profile,
      user: {
        username: user.username,
        profileImage: user.profileImage,
        email: user.email,
      },
      education: educationRecords,
      experience: experienceRecords,
      about,
      achievements,
      contributions,
      skills,
      socialLinks,
    };

    return c.json({ success: true, data: responseData });
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

module.exports = profiledataRoute;
