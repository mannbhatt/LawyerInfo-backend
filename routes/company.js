const { Hono } = require("hono");
const Company = require("../models/company");

const companyRoute = new Hono();

// 📌 Get All Companies
companyRoute.get("/", async (c) => {
  try {
    const companies = await Company.find();
    return c.json({ success: true, companies });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return c.json({ success: false, error: "Failed to fetch companies" }, 500);
  }
});

// 📌 Add a New Company (Admin only)
companyRoute.post("/", async (c) => {
  try {
    const body = await c.req.json();
    if (!body.name) return c.json({ success: false, error: "Company name is required" }, 400);

    const existingCompany = await Company.findOne({ name: body.name });
    if (existingCompany) return c.json({ success: false, error: "Company already exists" }, 400);

    const newCompany = await Company.create({ name: body.name });
    return c.json({ success: true, company: newCompany });
  } catch (error) {
    console.error("Error adding company:", error);
    return c.json({ success: false, error: "Failed to add company" }, 500);
  }
});

module.exports = companyRoute;
