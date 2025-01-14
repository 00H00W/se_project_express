const router = require("express").Router();
const itemController = require("../controllers/clothingItems");

router.get("/", itemController.getItems);
router.post("/", itemController.createItem);
router.delete("/:itemId", itemController.deleteItem);
router.put("/:itemId/likes", itemController.likeItem);
router.delete("/:itemId/likes", itemController.unlikeItem);

module.exports = router;
