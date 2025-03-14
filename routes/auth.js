const {Hono}=require('hono');
const authController = require("../controllers/auth");
const { verifyToken } = require('../middleware/auth'); 
const router = new Hono();

router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);
router.get("/:username", authController.username);

router.post("/forgot-password",authController.forgotPassword);
router.post("/reset-password",authController.resetPassword);
module.exports = router;
