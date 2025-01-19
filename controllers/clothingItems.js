const Item = require("../models/clothingItem");
const {
  GENERIC_ERROR,
  BAD_REQUEST_ERROR,
  PAGE_NOT_FOUND_ERROR,
  FORBIDDEN_ERROR,
} = require("../utils/errors");

const getItems = (req, res) => {
  Item.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(GENERIC_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  Item.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201).send(item);
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

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  Item.findById(itemId)
    .orFail()
    .then((item) => {
      if (req.user._id === String(item.owner)) {
        Item.findByIdAndDelete(itemId)
          .then(() => res.status(200).send(item))
          .catch(console.error);
      } else {
        res.status(FORBIDDEN_ERROR).send({ message: "Authorization error" });
      }
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

const likeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
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

const unlikeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
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

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
