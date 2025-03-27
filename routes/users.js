const router = require("express").Router();
const userController = require("../controllers/users");
const auth = require("../middlewares/auth");
const { validateUserUpdate } = require("../middlewares/validation");

router.use(auth);
router.get("/me", userController.getCurrentUser);
router.patch("/me", validateUserUpdate, userController.updateUser);

module.exports = router;
