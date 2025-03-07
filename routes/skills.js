const { Hono } = require("hono");
const Skill = require("../models/skills");
const { verifyToken } = require("../middleware/auth");

const skillRoute = new Hono();

// 🔹 Add or Update Skills (Protected)
skillRoute.post("/me", verifyToken, async (c) => {
  try {
    const userId = c.get("user").id;
    const { skills } = await c.req.json();

    if (!Array.isArray(skills) || skills.length === 0) {
      return c.json({ success: false, message: "Skills must be a non-empty array" }, 400);
    }

    // Find if user already has a skill record
    let skillRecord = await Skill.findOne({ user_id: userId });

    if (skillRecord) {
      skillRecord.skills = skills;
      await skillRecord.save();
    } else {
      skillRecord = new Skill({ user_id: userId, skills });
      await skillRecord.save();
    }

    return c.json({ success: true, message: "Skills updated successfully", skillRecord });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});
skillRoute.put("/me", verifyToken, async (c) => {
  try {
    const userId = c.get("user").id;
    const { skills } = await c.req.json();

    if (!Array.isArray(skills) || skills.length === 0) {
      return c.json({ success: false, message: "Skills must be a non-empty array" }, 400);
    }

    // Find if user already has a skill record
    let skillRecord = await Skill.findOne({ user_id: userId });

    if (skillRecord) {
      skillRecord.skills = skills;
      await skillRecord.save();
    } else {
      skillRecord = new Skill({ user_id: userId, skills });
      await skillRecord.save();
    }

    return c.json({ success: true, message: "Skills updated successfully", skillRecord });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// 🔹 Get Skills of Logged-in User
skillRoute.get("/", verifyToken, async (c) => {
  try {
    const userId = c.get("user").id;
    const skillRecord = await Skill.findOne({ user_id: userId });

    if (!skillRecord) {
      return c.json({ success: false, message: "No skills found" }, 404);
    }

    return c.json({ success: true, skills: skillRecord.skills });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});
skillRoute.get("/:user_id", async (c) => {
  try {
    const { user_id } = c.req.param(); // Get user_id from URL params
    const skillRecord = await Skill.findOne({ user_id: user_id });

    if (!skillRecord) {
      return c.json({ success: false, message: "No skills found" }, 404);
    }

    return c.json({ success: true, skills: skillRecord.skills });
  } catch (error) {
    console.error("Error fetching skills:", error);
    return c.json({ success: false, message: error.message }, 500);
  }
});

// 🔹 Delete a Specific Skill
skillRoute.delete("/:skill", verifyToken, async (c) => {
  try {
    const userId = c.get("user").id;
    const skillToDelete = decodeURIComponent(c.req.param("skill"));

    const skillRecord = await Skill.findOne({ user_id: userId });

    if (!skillRecord) {
      return c.json({ success: false, message: "No skills found" }, 404);
    }

    // Remove the skill
    skillRecord.skills = skillRecord.skills.filter(skill => skill !== skillToDelete);
    await skillRecord.save();

    return c.json({ success: true, message: "Skill deleted successfully", skills: skillRecord.skills });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

module.exports = skillRoute;
