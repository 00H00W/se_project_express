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
const ConflictError = require("../errors/ConflictError");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const UnauthorizedError = require("../errors/UnauthorizedError");

const createUser = (req, res, next) => {
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
      if (err.code === 11000)
        next(new ConflictError("A user with this email already exists."));
      else if (err.name === "ValidationError")
        next(new BadRequestError(err.message));
      else next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") next(new BadRequestError(err.message));
      else if (err.name === "DocumentNotFoundError")
        next(new NotFoundError("Requested resource not found"));
      else next(err);
    });
};

const updateUser = (req, res, next) => {
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
      if (err.name === "ValidationError")
        next(new BadRequestError(err.message));
      else next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Cannot find user by credentials")
        next(new BadRequestError(err.message));
      else if (err.message === "Incorrect email or password")
        next(new UnauthorizedError(err.message));
      else next(err);
    });
};

module.exports = { createUser, getCurrentUser, login, updateUser };
