const { Hono } = require("hono");
const Profile = require("../models/profiles");
const User = require("../models/user");

const searchdataRoute = new Hono();

/*searchdataRoute.get("/search", async (c) => {
  try {
    const url = new URL(c.req.url)
    const username = url.searchParams.get("username")
    const city = url.searchParams.get("city")

    if (!username && !city) {
      return c.json(
        {
          success: false,
          message: "Please provide a username or city to search.",
        },
        400,
      )
    }

    let results = []

    // Case 1: Both username and city provided
    if (username && city) {
      // First find users with matching username
      const users = await User.find({
        username: { $regex: username, $options: "i" },
      }).select("_id username")

      if (users.length > 0) {
        // Get user IDs
        const userIds = users.map((user) => user._id)

        // Find profiles that match both user IDs and city
        const profiles = await Profile.find({
          userId: { $in: userIds },
          city: { $regex: city, $options: "i" },
        })

        // Combine user and profile data
        results = profiles.map((profile) => {
          const user = users.find((u) => u._id.toString() === profile.userId.toString())
          return {
            id: profile._id,
            username: user ? user.username : "Unknown",
            fullName: profile.fullName || "Unknown",
            city: profile.city || "Unknown",
            profileImage: profile.profileImage || null,
          }
        })
      }
    }
    // Case 2: Only username provided
    else if (username) {
      // Find users with matching username
      const users = await User.find({
        username: { $regex: username, $options: "i" },
      }).select("_id username")

      if (users.length > 0) {
        // Get user IDs
        const userIds = users.map((user) => user._id)
	
        // Find corresponding profiles
        const profiles = await Profile.find({
          userId: { $in: userIds },
        })

        // Combine user and profile data
        results = users.map((user) => {
          const profile = profiles.find((p) => p.userId.toString() === user._id.toString())
          return {
            id: user._id,
            username: user.username,
            fullName: profile ? profile.fullName : user.username,
            city: profile ? profile.city : "Unknown",
            profileImage: profile ? profile.profileImage : null,
          }
        })
      }
    }
    // Case 3: Only city provided
    else if (city) {
      // Find profiles with matching city
      const profiles = await Profile.find({
        city: { $regex: city, $options: "i" },
      })

      if (profiles.length > 0) {
        // Get user IDs from profiles
        const userIds = profiles.map((profile) => profile.userId)

        // Find corresponding users
        const users = await User.find({
          _id: { $in: userIds },
        }).select("_id username")

        // Combine profile and user data
        results = profiles.map((profile) => {
          const user = users.find((u) => u._id.toString() === profile.userId.toString())
          return {
            id: profile._id,
            username: user ? user.username : "Unknown",
            fullName: profile.fullName || "Unknown",
            city: profile.city || "Unknown",
            profileImage: profile.profileImage || null,
          }
        })
      }
    }

    return c.json({
      success: true,
      users: results,
    })
  } catch (error) {
    console.error("Error searching profiles:", error)
    return c.json(
      {
        success: false,
        message: "Internal Server Error",
        error: error.message,
      },
      500,
    )

  }
})
*/
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


