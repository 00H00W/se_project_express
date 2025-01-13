const router = require("express").Router();

router.get("/", (req, res) => {
  console.log("Get users");
});
router.get("/:userId", (req, res) => {
  console.log("Get user by id");
});
router.post("/", (req, res) => {
  console.log("Post users");
  // takes name and avatar
});

module.exports = router;
