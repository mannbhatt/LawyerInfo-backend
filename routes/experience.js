const { Hono } = require('hono');
const Experience = require('../models/experience'); 
const { verifyToken } = require('../middleware/auth'); 

const experienceRoute = new Hono();

// Create Experience (Protected Route)
experienceRoute.post('/', verifyToken, async (c) => {
  try {
    const { company, position, startDate, endDate, description } = await c.req.json();
    const userId = c.get('user').id; 
    const experience = new Experience({ userId, company, position, startDate, endDate, description });
    await experience.save();

    return c.json({ success: true, message: 'Experience added', experience });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Get all experience records for a user
experienceRoute.get('/', verifyToken, async (c) => {
  try {
    const userId = c.get('user').id;
    const experiences = await Experience.find({ userId });

    return c.json({ success: true, experiences });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});
experienceRoute.get('/:userId', async (c) => {
  try {
    const { userId } = c.req.param(); // Get user_id from URL params
    const experiences = await Experience.find({userId: userId });

    if (!experiences || experiences.length === 0) {
      return c.json({ success: false, message: "No experience records found" }, 404);
    }

    return c.json({ success: true, experiences });
  } catch (error) {
    console.error("Error fetching experience records:", error);
    return c.json({ success: false, message: error.message }, 500);
  }
});


// Get a single experience record by ID
experienceRoute.get('/:id', verifyToken, async (c) => {
  try {
    const experience = await Experience.findById(c.req.param('id'));

    if (!experience) return c.json({ success: false, message: 'Experience not found' }, 404);

    return c.json({ success: true, experience });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Update experience record
experienceRoute.put("/me", verifyToken, async (c) => {
  try {
    const userId = c.get("user").id; 
    const experienceData = await c.req.json(); 

    if (!Array.isArray(experienceData) || experienceData.length === 0) {
      return c.json({ success: false, message: "Invalid or empty experience data" }, 400);
    }

    
    await Experience.deleteMany({ userId });

    
    const updatedExperience = await Experience.insertMany(
      experienceData.map((exp) => ({ ...exp, userId }))
    );

    return c.json({ success: true, message: "Experience updated successfully", updatedExperience });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Delete experience record
experienceRoute.delete('/:id', verifyToken, async (c) => {
  try {
    const deletedExperience = await Experience.findByIdAndDelete(c.req.param('id'));

    if (!deletedExperience) return c.json({ success: false, message: 'Experience not found' }, 404);

    return c.json({ success: true, message: 'Experience deleted' });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

module.exports = experienceRoute;
