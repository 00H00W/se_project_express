const router = require("express").Router();
const { PAGE_NOT_FOUND_ERROR } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");
const {
  validateAuthentication,
  validateUserInfo,
} = require("../middlewares/validation");

const userRouter = require("./users");
const itemRouter = require("./clothingItems");

router.post("/signup", validateUserInfo, createUser);
router.post("/signin", validateAuthentication, login);

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(PAGE_NOT_FOUND_ERROR).send({ message: "Page not found" });
});

module.exports = router;
