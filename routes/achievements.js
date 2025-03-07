const { Hono } = require("hono");
const Achievements = require("../models/achievements");
const { verifyToken } = require("../middleware/auth");

const licenseRoute = new Hono();

// 🔹 Create a new certification (Protected)
licenseRoute.post("/", verifyToken, async (c) => {
  try {
    const { certificate_name, issuing_organization, issue_date, credential_url, certificate_image,imageKey } = await c.req.json();
    const userId = c.get("user").id;

    const newCertification = new Achievements({
      user_id: userId,
      certificate_name,
      issuing_organization,
      issue_date,
      credential_url,
      certificate_image,
	imageKey,
    });

    await newCertification.save();
    return c.json({ success: true, message: "Certification added successfully", certification: newCertification });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// 🔹 Get all certifications for a user
licenseRoute.get("/", verifyToken, async (c) => {
  try {
    const userId = c.get("user").id;
    const certifications = await Achievements.find({ user_id: userId }).sort({ issue_date: -1 });
	
    return c.json({ success: true, certifications });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});
licenseRoute.get("/:user_id", async (c) => {
  try {
    const { user_id } = c.req.param();
    const certifications = await Achievements.find({ user_id: user_id }).sort({ issueDate: -1 });

    if (!certifications || certifications.length === 0) {
      return c.json({ success: false, message: "No certifications found" }, 404);
    }

    return c.json({ success: true, certifications });
  } catch (error) {
    console.error("Error fetching certifications:", error);
    return c.json({ success: false, message: error.message }, 500);
  }
});

// 🔹 Get a single certification by ID
licenseRoute.get("/:id", verifyToken, async (c) => {
  try {
    const certification = await Achivments.findById(c.req.param("id"));

    if (!certification) return c.json({ success: false, message: "Certification not found" }, 404);

    return c.json({ success: true, certification });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// 🔹 Update certifications for a user
licenseRoute.put("/me", verifyToken, async (c) => {
  try {
    const userId = c.get("user").id;
    const certificationData = await c.req.json();

    if (!Array.isArray(certificationData) || certificationData.length === 0) {
      return c.json({ success: false, message: "Invalid or empty certification data" }, 400);
    }

    // Delete existing certifications for the user
    await Achievements.deleteMany({ user_id: userId });

    // Insert new certifications
    const updatedCertifications = await Achievements.insertMany(
      certificationData.map((cert) => ({ ...cert, user_id: userId }))
    );

    return c.json({ success: true, message: "Certifications updated successfully", updatedCertifications });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// 🔹 Delete a certification by ID
licenseRoute.delete("/:id", verifyToken, async (c) => {
  try {
    const deletedCertification = await Achivments.findByIdAndDelete(c.req.param("id"));

    if (!deletedCertification) return c.json({ success: false, message: "Certification not found" }, 404);

    return c.json({ success: true, message: "Certification deleted successfully" });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

module.exports = licenseRoute;
