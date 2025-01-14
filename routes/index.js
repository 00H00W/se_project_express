const router = require("express").Router();
const { PAGE_NOT_FOUND_ERROR } = require("../utils/errors");

const userRouter = require("./users");
const itemRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(PAGE_NOT_FOUND_ERROR).send({ message: "Page not found" });
});

module.exports = router;
