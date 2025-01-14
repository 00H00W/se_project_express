const clothingItem = require("../models/clothingItem");
const Item = require("../models/clothingItem");

const getItems = (req, res) => {
  Item.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(500)
        .send({ message: "An error has occurred on the server." });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const { _id } = req.user;

  Item.create({ name, weather, imageUrl, creator: _id })
    .then((item) => {
      res.status(201).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError")
        return res.status(400).send({ message: err.message });
      return res
        .status(500)
        .send({ message: "An error has occurred on the server." });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  Item.findByIdAndRemove(itemId)
    .orFail()
    .then((item) => {
      res.status(204).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError")
        return res.status(400).send({ message: err.message });
      else if (err.name === "DocumentNotFoundError")
        return res
          .status(404)
          .send({ message: "Requested resource not found" });
      return res
        .status(500)
        .send({ message: "An error has occurred on the server." });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;
  Item.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError")
        return res.status(400).send({ message: err.message });
      else if (err.name === "DocumentNotFoundError")
        return res
          .status(404)
          .send({ message: "Requested resource not found" });
      return res
        .status(500)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = { getItems, createItem, deleteItem, updateItem };
