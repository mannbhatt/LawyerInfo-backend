const { Hono } = require("hono");
const Contribution = require("../models/contribution");
const { verifyToken } = require("../middleware/auth");

const contributionRoute = new Hono();

// 🔹 Create Contribution (Protected)
contributionRoute.post("/", verifyToken, async (c) => {
  try {
    const {title, category, description,external_link } = await c.req.json();
    const userId = c.get("user").id;
    
    const contribution = new Contribution({ user_id:userId, title, category, description,external_link });
    await contribution.save();

    return c.json({ success: true, message: "Contribution added successfully", contribution });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// 🔹 Get All Contributions for a User
contributionRoute.get("/", verifyToken, async (c) => {
  try {
    const userId = c.get("user").id;
    const contributions = await Contribution.find({ user_id: userId }).sort({ issue_date: -1 });
	

    return c.json({ success: true, contributions });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});
contributionRoute.get("/:user_id", async (c) => {
  try {
    const { user_id } = c.req.param();
    const contributions = await Contribution.find({ user_id: user_id }).sort({ issueDate: -1 });

    if (!contributions || contributions.length === 0) {
      return c.json({ success: false, message: "No contributions found" }, 404);
    }

    return c.json({ success: true, contributions });
  } catch (error) {
    console.error("Error fetching contributions:", error);
    return c.json({ success: false, message: error.message }, 500);
  }
});

// 🔹 Get a Single Contribution by ID
contributionRoute.get("/:id", verifyToken, async (c) => {
  try {
    const contribution = await Contribution.findById(c.req.param("id"));

    if (!contribution) return c.json({ success: false, message: "Contribution not found" }, 404);

    return c.json({ success: true, contribution });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// 🔹 Update Contributions (Replace All)
contributionRoute.put("/me", verifyToken, async (c) => {
  try {
    const userId = c.get("user").id;
    const contributionData = await c.req.json();

    if (!Array.isArray(contributionData) || contributionData.length === 0) {
      return c.json({ success: false, message: "Invalid or empty contribution data" }, 400);
    }

    await Contribution.deleteMany({ user_id: userId });

    const updatedContributions = await Contribution.insertMany(
      contributionData.map((contrib) => ({ ...contrib, user_id: userId }))
    );

    return c.json({ success: true, message: "Contributions updated successfully", updatedContributions });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// 🔹 Delete Contribution by ID
contributionRoute.delete("/:id", verifyToken, async (c) => {
  try {
    const deletedContribution = await Contribution.findByIdAndDelete(c.req.param("id"));

    if (!deletedContribution) return c.json({ success: false, message: "Contribution not found" }, 404);

    return c.json({ success: true, message: "Contribution deleted successfully" });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

module.exports = contributionRoute;
