const Item = require("../models/clothingItem");

const getItems = (req, res) => {
  Item.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  Item.create({ name, weather, imageUrl })
    .then((item) => {
      res.status(201).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError")
        return res.status(400).send({ message: err.message });
      return res.status(500).send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  Item.findByIdAndRemove(itemId)
    .orFail()
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError")
        return res.status(400).send({ message: err.message });
      else if (err.name === "DocumentNotFoundError")
        return res.status(404).send({ message: err.message });
      return res.status(500).send({ message: err.message });
    });
};

module.exports = { getItems, createItem, deleteItem };
