const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  GENERIC_ERROR,
  BAD_REQUEST_ERROR,
  PAGE_NOT_FOUND_ERROR,
  CONFLICT_ERROR,
  UNAUTHENTICATED_ERROR,
} = require("../utils/errors");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      // delete user.password does not work.
      const returnData = user;
      returnData.password = undefined;
      return res.status(201).send({ returnData });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 11000)
        return res
          .status(CONFLICT_ERROR)
          .send({ message: "A user with this email already exists." });
      if (err.name === "ValidationError")
        return res.status(BAD_REQUEST_ERROR).send({ message: err.message });
      return res
        .status(GENERIC_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError")
        return res.status(BAD_REQUEST_ERROR).send({ message: err.message });
      if (err.name === "DocumentNotFoundError")
        return res
          .status(PAGE_NOT_FOUND_ERROR)
          .send({ message: "Requested resource not found" });
      return res
        .status(GENERIC_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user,
    { name, avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError")
        return res.status(BAD_REQUEST_ERROR).send({ message: err.message });
      return res
        .status(GENERIC_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Cannot find user by credentials") {
        return res.status(BAD_REQUEST_ERROR).send({ message: err.message });
      }
      if (err.message === "Incorrect email or password") {
        return res.status(UNAUTHENTICATED_ERROR).send({ message: err.message });
      }
      return res
        .status(GENERIC_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = { createUser, getCurrentUser, login, updateUser };
