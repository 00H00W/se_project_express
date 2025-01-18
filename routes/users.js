const router = require("express").Router();
const userController = require("../controllers/users");

router.get("/:userId", userController.getUser);

module.exports = router;
