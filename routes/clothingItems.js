const router = require("express").Router();
const itemController = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");

router.get("/", itemController.getItems);
router.use(auth);
router.post("/", itemController.createItem);
router.delete("/:itemId", itemController.deleteItem);
router.put("/:itemId/likes", itemController.likeItem);
router.delete("/:itemId/likes", itemController.unlikeItem);

module.exports = router;
