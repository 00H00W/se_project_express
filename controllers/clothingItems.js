const Item = require("../models/clothingItem");
const BadRequestError = require("../errors/BadRequestError");
const ForbiddenError = require("../errors/ForbiddenError");
const NotFoundError = require("../errors/NotFoundError");
const {
  GENERIC_ERROR,
  BAD_REQUEST_ERROR,
  PAGE_NOT_FOUND_ERROR,
  FORBIDDEN_ERROR,
} = require("../utils/errors");

const getItems = (req, res, next) => {
  Item.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch(next);
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  Item.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201).send(item);
    })
    .catch((err) => {
      if (err.name === "ValidationError")
        next(new BadRequestError("The id string is in an invalid format"));
      else next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  Item.findById(itemId)
    .orFail()
    .then((item) => {
      if (req.user._id === String(item.owner)) {
        Item.findByIdAndDelete(itemId)
          .then(() => res.status(200).send(item))
          .catch(console.error);
      } else {
        next(new ForbiddenError("Authorization error"));
      }
    })
    .catch((err) => {
      if (err.name === "CastError") next(new BadRequestError(err.message));
      else if (err.name === "DocumentNotFoundError")
        next(new NotFoundError("Requested resource not found"));
      else next(err);
    });
};

const likeItem = (req, res, next) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "CastError") next(new BadRequestError(err.message));
      else if (err.name === "DocumentNotFoundError")
        next(new NotFoundError("Requested resource not found"));
      else next(err);
    });
};

const unlikeItem = (req, res, next) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "CastError") next(new BadRequestError(err.message));
      else if (err.name === "DocumentNotFoundError")
        next(new NotFoundError("Requested resource not found"));
      else next(err);
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
