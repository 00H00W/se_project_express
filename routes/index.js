const router = require("express").Router();
const { login, createUser } = require("../controllers/users");
const {
  validateAuthentication,
  validateUserInfo,
} = require("../middlewares/validation");

const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const NotFoundError = require("../errors/NotFoundError");

router.post("/signup", validateUserInfo, createUser);
router.post("/signin", validateAuthentication, login);

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Page not found"));
});

module.exports = router;
