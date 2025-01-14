const User = require("../models/user");
const {
  GENERIC_ERROR,
  BAD_REQUEST_ERROR,
  PAGE_NOT_FOUND_ERROR,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(GENERIC_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError")
        return res.status(BAD_REQUEST_ERROR).send({ message: err.message });
      return res
        .status(GENERIC_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
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
          .status(PAGE_NOT_FOUND_ERRORs)
          .send({ message: "Requested resource not found" });
      return res
        .status(GENERIC_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = { getUsers, createUser, getUser };
