const { Hono } = require("hono");
const Profile = require("../models/profiles");
const User = require("../models/user");

const searchdataRoute = new Hono();


searchdataRoute.get("/search", async (c) => {
  try {
    const url = new URL(c.req.url);
    const fullName = url.searchParams.get("fullName");
    const city = url.searchParams.get("city");

    if (!fullName && !city) {
      return c.json(
        {
          success: false,
          message: "Please provide a full name or city to search.",
        },
        400
      );
    }

    let results = [];

    // Case 1: Searching by fullName and city
    if (fullName && city) {
      const profiles = await Profile.find({
        fullName: { $regex: fullName, $options: "i" },
        city: { $regex: city, $options: "i" },
      });

      if (profiles.length > 0) {
        const userIds = profiles.map((profile) => profile.userId);
        const users = await User.find({ _id: { $in: userIds } }).select("_id username");

        results = profiles.map((profile) => {
          const user = users.find((u) => u._id.toString() === profile.userId.toString());
          return {
            id: profile._id,
            username: user ? user.username : "Unknown",
            fullName: profile.fullName || "Unknown",
            city: profile.city || "Unknown",
            profileImage: profile.profileImage || null,
          };
        });
      }
    }
    // Case 2: Searching by fullName only
    else if (fullName) {
      const profiles = await Profile.find({
        fullName: { $regex: fullName, $options: "i" },
      });

      if (profiles.length > 0) {
        const userIds = profiles.map((profile) => profile.userId);
        const users = await User.find({ _id: { $in: userIds } }).select("_id username");

        results = profiles.map((profile) => {
          const user = users.find((u) => u._id.toString() === profile.userId.toString());
          return {
            id: profile._id,
            username: user ? user.username : "Unknown",
            fullName: profile.fullName || "Unknown",
            city: profile.city || "Unknown",
            profileImage: profile.profileImage || null,
          };
        });
      }
    }
    // Case 3: Searching by city only
    else if (city) {
      const profiles = await Profile.find({
        city: { $regex: city, $options: "i" },
      });

      if (profiles.length > 0) {
        const userIds = profiles.map((profile) => profile.userId);
        const users = await User.find({ _id: { $in: userIds } }).select("_id username");

        results = profiles.map((profile) => {
          const user = users.find((u) => u._id.toString() === profile.userId.toString());
          return {
            id: profile._id,
            username: user ? user.username : "Unknown",
            fullName: profile.fullName || "Unknown",
            city: profile.city || "Unknown",
            profileImage: profile.profileImage || null,
          };
        });
      }
    }

    return c.json({
      success: true,
      users: results,
    });
  } catch (error) {
    console.error("Error searching profiles:", error);
    return c.json(
      {
        success: false,
        message: "Internal Server Error",
        error: error.message,
      },
      500
    );
  }
});

module.exports = searchdataRoute;


