const {Hono}=require('hono');
const authController = require("../controllers/auth");

const router = new Hono();

router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);
router.get("/:username", authController.username);
module.exports = router;
