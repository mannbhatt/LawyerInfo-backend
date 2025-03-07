const jwt = require("jsonwebtoken");

const verifyToken = async (c, next) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) return c.json({ success: false, message: "No token provided" }, 401);

    const token = authHeader.split(" ")[1];
    if (!token) return c.json({ success: false, message: "Token missing" }, 401);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    c.set("user", { id: decoded.id }); 
   
    return next();
  } catch (error) {
    return c.json({ success: false, message: "Invalid or expired token" }, 401);
  }
};

module.exports = { verifyToken };
