const { Hono } = require("hono");
const jwt = require("jsonwebtoken");
const Profile = require("../models/profiles");
const User = require("../models/user");
const profileRoute = new Hono();

const authenticate = async (c, next) => {
 
  try {
    const authHeader = c.req.header("Authorization");
   
    if (!authHeader) {  
      return c.json({ success: false, error: "No token provided" }, 401);
    }

    if (!authHeader.startsWith("Bearer ")) {
      return c.json({ success: false, error: "Invalid auth format" }, 401);
    }

    const token = authHeader.split(" ")[1]; 
   
    if (!token) {
      return c.json({ success: false, error: "Token missing" }, 401);
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
     
      c.set("userId", decoded.id); 
      await next();
    } catch (error) {
      console.log("JWT Verification Error:", error.message);
      return c.json({ success: false, error: "Invalid token" }, 401);
    }
  } catch (error) {
    console.log("Unexpected Error:", error);
    return c.json({ success: false, error: "Authentication failed" }, 500);
  }
};
profileRoute.post("/", authenticate, async (c) => {  
  try {
    const userId = c.get("userId");
    const body = await c.req.json();

    if (!userId) {
      return c.json({ success: false, error: "User ID missing" }, 400);
    }

    // Check if profile already exists
    const existingProfile = await Profile.findOne({ userId });
    if (existingProfile) {
      return c.json({ success: false, error: "Profile already exists" }, 400);
    }

    const profileData = {
      userId,
email:body.email,
      fullName: body.fullName || "Unnamed User",
      phone: body.phone || "Not Provided",
      dateOfBirth: body.dateOfBirth || "2000-01-01",
      gender: body.gender || "Male",
      profileImage: body.profileImage || "",
      imageKey:body.imageKey || "",
      bio: body.bio || "",
	city:body.city || "",
    };
    const profile = await Profile.create(profileData);

    return c.json({ success: true, profile });
  } catch (error) {
    console.error("Profile Creation Error:", error);  // Log error to console
    return c.json({ success: false, error: error.message }, 500);
  }
});


profileRoute.get("/me", authenticate, async (c) => {
  try {
    const userId = c.get("userId");
    const profile = await Profile.findOne({ userId });

    if (!profile) return c.json({ success: false, error: "Profile not found" }, 404);

    return c.json({ success: true, profile });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

profileRoute.put("/me", authenticate, async (c) => {
  try {
    const userId = c.get("userId");
    const body = await c.req.json();

    const profile = await Profile.findOneAndUpdate({ userId }, body, { new: true });

    if (!profile) return c.json({ success: false, error: "Profile not found" }, 404);

    return c.json({ success: true, profile });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

profileRoute.delete("/me", authenticate, async (c) => {
  try {
    const userId = c.get("userId");

    const profile = await Profile.findOneAndDelete({ userId });

    if (!profile) return c.json({ success: false, error: "Profile not found" }, 404);

    return c.json({ success: true, message: "Profile deleted successfully" });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

profileRoute.get("/:user_id", async (c) => {
  try {
    const { user_id } = c.req.param(); // Get user_id from URL params
    const profile = await Profile.findOne({ userId: user_id });

    if (!profile) return c.json({ success: false, error: "Profile not found" }, 404);

    return c.json({ success: true, profile });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});


profileRoute.get("/", async (c) => {
  try {
    // Find users with flag = true
    const users = await User.find({ flag: true }).select("username");
    const userIds = users.map(user => user._id);

    // Find corresponding profiles
    const profiles = await Profile.find({ userId: { $in: userIds } });

    // Combine user and profile data
    const combinedProfiles = users.map(user => {
      const profile = profiles.find(p => p.userId.toString() === user._id.toString()) || {};
      return {
        id: user._id,
        name: profile.fullName || user.username,
        bio: profile.bio|| "Not provided",
        city: profile.city || "Unknown",
        imageUrl: profile.profileImage || "/default-profile.png",
	username:user.username,
      };
    });

    return c.json({ success: true, profiles: combinedProfiles });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return c.json({ success: false, error: "Internal Server Error" }, 500);
  }
});

profileRoute.get("/search", async (req, res) => {
  try {
    const { username, city } = req.query;
	console.log(">>>>>>>>>>>>>>>>>>>>>>>")
    if (!username && !city) {
      return res.status(400).json({ success: false, error: "Provide at least a username or city to search." });
    }

    let matchQuery = {};

    if (username) {
      // 🔍 Find users with matching usernames (case-insensitive)
      const users = await User.find({  $regex: username, $options: "i"}).select("_id username");
console.log(">>>>>>>>>>>>>>>>>>>>>>>")    ;
  if (users.length === 0) return res.status(404).json({ success: false, message: "No users found with that username." });
	
      // Extract user IDs to use for profile filtering
      matchQuery.userId = { $in: users.map((user) => user._id) };
    }

    if (city) {
      matchQuery.city = { $regex: city, $options: "i" }; // 🔍 Case-insensitive city search
    }
console.log(">>>>>>>>>>>>>>>>>>>>>>>")
    // ✅ Fetch profiles matching criteria
    const profiles = await Profile.find(matchQuery).populate("userId", "username profileImage");

    if (profiles.length === 0) {
      return res.status(404).json({ success: false, message: "No profiles found." });
    }
console.log(">>>>>>>>>>>>>>>>>>>>>>>")
    // ✅ Format response data
    const results = profiles.map((profile) => ({
      username: profile.userId.username,
      profileImage: profile.userId.profileImage || "/default-profile.png",
      city: profile.city,
    }));

    res.json({ success: true, users: results });
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }

});

module.exports = profileRoute;
