const router = require("express").Router();
const userController = require("../controllers/users");
const auth = require("../middlewares/auth");

router.use(auth);
router.get("/me", userController.getCurrentUser);

module.exports = router;
