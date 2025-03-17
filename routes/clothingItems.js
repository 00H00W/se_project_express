const router = require("express").Router();
const itemController = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");
const {
  validateClothingItem,
  validateItemId,
} = require("../middlewares/validation");

router.get("/", itemController.getItems);
router.use(auth);
router.post("/", validateClothingItem, itemController.createItem);
router.delete("/:itemId", validateItemId, itemController.deleteItem);
router.put("/:itemId/likes", validateItemId, itemController.likeItem);
router.delete("/:itemId/likes", validateItemId, itemController.unlikeItem);

module.exports = router;
