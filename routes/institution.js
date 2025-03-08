const { Hono } = require("hono");
const Institution = require("../models/institution");

const institutionRoute = new Hono();

// Get all institutions
institutionRoute.get("/", async (c) => {
  try {
    const institutions = await Institution.find().sort({ name: 1 });
    return c.json({ success: true, institutions });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

module.exports = institutionRoute;
