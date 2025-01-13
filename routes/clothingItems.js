const router = require("express").Router();
const itemController = require("../controllers/clothingItems");

router.get("/", itemController.getItems);
router.post("/", itemController.createItem);
router.delete("/:itemId", itemController.deleteItem);

module.exports = router;
