const { Hono } = require('hono');
const Education = require('../models/education'); 
const { verifyToken } = require('../middleware/auth'); 

const educationRoute = new Hono();

// 🔹 Create Education Record (Protected)
educationRoute.post('/', verifyToken, async (c) => {
  try {
    const { institution, degree, startDate, endDate, grade,description} = await c.req.json();
    const userId = c.get('user').id;
	
    const education = new Education({ userId, institution, degree, startDate, endDate, grade,description });
    await education.save();

    return c.json({ success: true, message: 'Education record added', education });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// 🔹 Get All Education Records for a User
educationRoute.get('/', verifyToken, async (c) => {
  try {
    const userId = c.get("user").id;
    const educationRecords = await Education.find({ userId }).sort({ startDate: -1 });

    return c.json({ success: true, educationRecords });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

educationRoute.get('/:userId', async (c) => {
  try {
    const { userId } = c.req.param(); // Get user_id from URL params
    const educationRecords = await Education.find({ userId: userId }).sort({ startDate: -1 });

    if (!educationRecords || educationRecords.length === 0) {
      return c.json({ success: false, message: "No education records found" }, 404);
    }

    return c.json({ success: true, educationRecords });
  } catch (error) {
    console.error("Error fetching education records:", error);
    return c.json({ success: false, message: error.message }, 500);
  }
});

// 🔹 Get a Single Education Record by ID




// 🔹 Update Education Record
educationRoute.put("/me", verifyToken, async (c) => {
  try {
    const userId = c.get("user").id;
    const educationData = await c.req.json(); 

    if (!Array.isArray(educationData) || educationData.length === 0) {
      return c.json({ success: false, message: "Invalid or empty education data" }, 400);
    }

    
    await Education.deleteMany({ userId });

   
    const updatedEducation = await Education.insertMany(
      educationData.map((edu) => ({ ...edu, userId }))
    );

    return c.json({ success: true, message: "Education updated successfully", updatedEducation });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});



// 🔹 Delete Education Record
educationRoute.delete('/:id', verifyToken, async (c) => {
  try {
    const deletedEducation = await Education.findByIdAndDelete(c.req.param('id'));

    if (!deletedEducation) return c.json({ success: false, message: 'Education record not found' }, 404);

    return c.json({ success: true, message: 'Education record deleted successfully' });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

module.exports = educationRoute;
