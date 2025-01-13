const router = require("express").Router();

router.get("/", (req, res) => {
  console.log("Get items");
});
router.post("/", (req, res) => {
  console.log("Create item");
  // name, weather type, image Url
  // user ID
});
router.delete("/:itemId", (req, res) => {
  console.log("delete item");
});

module.exports = router;
