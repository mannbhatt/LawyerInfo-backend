const { Hono } = require('hono');
const About = require('../models/about'); // Import About model
const { verifyToken } = require('../middleware/auth'); // Middleware for authentication

const aboutRoute = new Hono();

// 🔹 Create or Update About Info (Protected)
aboutRoute.post('/', verifyToken, async (c) => {
  try {
    const { summary, highlights, hobbies, personal_website } = await c.req.json();
    const user_id = c.get('user').id; // Extract user ID from token

    const updatedAbout = await About.findOneAndUpdate(
      { user_id },
      { summary, highlights, hobbies, personal_website },
      { new: true, upsert: true } // Create if not exists
    );

    return c.json({ success: true, message: 'About section updated successfully', about: updatedAbout });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});
aboutRoute.put("/me", verifyToken, async (c) => {
  try {
    const { summary, highlights, hobbies, personal_website } = await c.req.json();
    const user_id = c.get('user').id; // Extract user ID from token

    const updatedAbout = await About.findOneAndUpdate(
      { user_id },
      { summary, highlights, hobbies, personal_website },
      { new: true, upsert: true } // Create if not exists
    );

    return c.json({ success: true, message: 'About section updated successfully', about: updatedAbout });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});
// 🔹 Get About Info for a User
aboutRoute.get('/', verifyToken, async (c) => {
  try {
    const user_id = c.get('user').id;
    const about = await About.findOne({ user_id });

    if (!about) return c.json({ success: false, message: 'No About info found' }, 404);

    return c.json({ success: true, about });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});
aboutRoute.get('/:user_id', async (c) => {
  try {
    const { user_id } = c.req.param();
    const about = await About.findOne({ user_id: user_id });

    if (!about) return c.json({ success: false, message: 'No About info found' }, 404);

    return c.json({ success: true, about });
  } catch (error) {
    console.error("Error fetching About info:", error);
    return c.json({ success: false, message: error.message }, 500);
  }
});

// 🔹 Delete About Info
aboutRoute.delete('/', verifyToken, async (c) => {
  try {
    const user_id = c.get('user').id;
    await About.findOneAndDelete({ user_id });

    return c.json({ success: true, message: 'About section deleted successfully' });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

module.exports = aboutRoute;
