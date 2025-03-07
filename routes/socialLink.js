const { Hono } = require("hono");
const SocialLink = require("../models/socialLink");
const { verifyToken } = require("../middleware/auth");

const socialLinkRoute = new Hono();

// 🔹 Add or Update Social Links (Protected)
socialLinkRoute.post("/", verifyToken, async (c) => {
  try {
    const userId = c.get("user").id;
    const { links } = await c.req.json();

    if (typeof links !== "object" || Object.keys(links).length === 0) {
      return c.json({ success: false, message: "Invalid links data" }, 400);
    }

    // Find if user already has social links
    let socialLinkRecord = await SocialLink.findOne({ user_id: userId });

    if (socialLinkRecord) {
      socialLinkRecord.links = { ...socialLinkRecord.links, ...links }; // Merge new and existing links
      await socialLinkRecord.save();
    } else {
      socialLinkRecord = new SocialLink({ user_id: userId, links });
      await socialLinkRecord.save();
    }

    return c.json({ success: true, message: "Social links updated successfully", socialLinkRecord });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

socialLinkRoute.put("/me", verifyToken, async (c) => {
  try {
    const userId = c.get("user").id;
    const { links } = await c.req.json();

    if (typeof links !== "object" || Object.keys(links).length === 0) {
      return c.json({ success: false, message: "Invalid links data" }, 400);
    }

    // Find if user already has social links
    let socialLinkRecord = await SocialLink.findOne({ user_id: userId });

    if (socialLinkRecord) {
      socialLinkRecord.links = { ...socialLinkRecord.links, ...links }; // Merge new and existing links
      await socialLinkRecord.save();
    } else {
      socialLinkRecord = new SocialLink({ user_id: userId, links });
      await socialLinkRecord.save();
    }

    return c.json({ success: true, message: "Social links updated successfully", socialLinkRecord });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// 🔹 Get Social Links of Logged-in User
socialLinkRoute.get("/", verifyToken, async (c) => {
  try {
    const userId = c.get("user").id;
    const socialLinkRecord = await SocialLink.findOne({ user_id: userId });

    if (!socialLinkRecord) {
      return c.json({ success: false, message: "No social links found" }, 404);
    }

    return c.json({ success: true, links: socialLinkRecord.links });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});
socialLinkRoute.get("/:user_id", async (c) => {
  try {
    const { user_id } = c.req.param();
    const socialLinkRecord = await SocialLink.findOne({ user_id: user_id });

    if (!socialLinkRecord) {
      return c.json({ success: false, message: "No social links found" }, 404);
    }

    return c.json({ success: true, links: socialLinkRecord.links });
  } catch (error) {
    console.error("Error fetching social links:", error);
    return c.json({ success: false, message: error.message }, 500);
  }
});

// 🔹 Delete a Specific Social Link
socialLinkRoute.delete("/:platform", verifyToken, async (c) => {
  try {
    const userId = c.get("user").id;
    const platform = c.req.param("platform").toLowerCase();

    const socialLinkRecord = await SocialLink.findOne({ user_id: userId });

    if (!socialLinkRecord || !socialLinkRecord.links[platform]) {
      return c.json({ success: false, message: `No ${platform} link found` }, 404);
    }

    // Remove the specific social link
    delete socialLinkRecord.links[platform];
    await socialLinkRecord.save();

    return c.json({ success: true, message: `${platform} link deleted successfully`, links: socialLinkRecord.links });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

module.exports = socialLinkRoute;
