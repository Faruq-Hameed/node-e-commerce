const express = require("express");
const router = express.Router();
const { Item, User } = require("../../database/models");
const { itemSchema, itemUpdateSchema } = require("../../utils/input_schema");
const { paginate, paginationError } = require("../../utils");

router.get(
  "/",
  (req, res, next) => {
    const getItemsByQuery = async () => {
      try {
        // the search parameters are to be passed by the user and are optional
        const value = req.query.maker
          ? { maker: req.query.maker }
          : req.query.itemName
          ? { itemName: req.query.itemName }
          : req.query.category
          ? { category: req.query.category }
          : {};

        const items = await Item.find(value); //all items will be returned if no query is provided
        req.query.items = items; //needed to pass to the next middleware function
        return next(); //pass the req to the next middleware function
      } catch (err) {
        return res.status(404).send({ message: "no match found" });
      }
    };
    getItemsByQuery();
  },
  // middleware needed for pagination of results to be returned
  (req, res) => {
    const { limit, page, items } = req.query;
    req.query = {}; //to delete all the query parameters that were passed to the middleware
    req.query = { limit, page }; //setting these values to be used for pagination validation and operations
    const error = paginationError(items, req);
    if (error) {
      res.status(error.status).json({ message: error.message });
      return;
    }
    const paginatedItemList = paginate(items, req, "item");
    res.status(200).json(paginatedItemList);
    return;
  }
);

router.get("/:id", (req, res) => {
  const getItemById = async () => {
    try {
      const item = await Item.findById(req.params.id);
      res.status(200).json({ item });
    } catch (err) {
      res.status(404).send({ message: "item with the id does not exist" });
    }
  };
  getItemById();
});

//only admin user should have the permissions to do everything below;
router.use("/:userId", (req, res, next) => {
  const admin = { id: process.env.adminId, name: process.env.adminName };
  if (req.params.userId && req.params.userId === admin.id) {
    return next();
  }
  res.status(401).send({ message: "unauthorized user" });
});

router.post("/:userId", (req, res) => {
  const validation = itemSchema(req.body);
  if (validation.error) {
    res.status(422).send(validation.error.details[0].message);
    return;
  }
  const createNewItem = async () => {
    try {
      const newItem = await Item.create(validation.value);
      res.status(200).send({ message: "new Item added successfully", newItem });
    } catch (err) {
      res.status(400).send(err.message);
    }
  };
  createNewItem();
});

router.put("/:userId/:itemId", (req, res) => {
  // validating the data input
  const validation = itemSchema(req.body);
  if (validation.error) {
    res.status(422).send(validation.error.details[0].message);
    return;
  }

  //update item with the new values from validation if no errors
  const updateItem = async () => {
    const item = await Item.findById(req.params.itemId);

    item.availableQuantity += validation.value.availableQuantity;
    delete validation.value.availableQuantity; //after it is been updated so it wont be in the loop

    for (keys in validation.value) {
      item[keys] = validation.value[keys];
    }
    await item.save();
    return res
      .status(200)
      .send({ message: "updated item successfully", item: item });
  };

  //calling the created functions and create a new item if it doesn't exist
  const startProcess = async () => {
    try {
      const item = await Item.findById(req.params.itemId);
      await updateItem();
    } catch (err) {
      {
        //if the item id does not exist
        const newItem = await Item.create(validation.value);
        res
          .status(200)
          .send({ message: "new item added successfully", newItem });
        return;
      }
    }
  };

  startProcess();
});

router.patch("/:userId/:itemId", (req, res) => {
  // validating the data input
  const validation = itemUpdateSchema(req.body);
  if (validation.error) {
    res.status(422).send(validation.error.details[0].message);
    return;
  }

  //update item with the new values from validation if no errors
  const updateItem = async () => {
    try {
      const item = await Item.findById(req.params.itemId);

      item.availableQuantity += validation.value.quantity;
      delete validation.value.availableQuantity; //after it is been updated so it wont be in the loop

      for (keys in validation.value) {
        item[keys] = validation.value[keys];
      }
      await item.save();
      return res
        .status(200)
        .send({ message: "updated item successfully", item: item });
    } catch (err) {
      //error response
      res.status(404).send({ message: "item not found to update" });
    }
  };
  updateItem();
});

router.delete("/:userId/:itemId", (req, res) => {
  const deleteItem = async () => {
    try {
      const item = await Item.findByIdAndDelete(req.params.itemId);
      if (!item) {
        res.status(410).send({ message: "item has already deleted" }); //incase null was returned
        return;
      }
      res.status(200).send({ message: "item deleted successfully" });
    } catch (err) {
      res.status(404).send({ message: "item not found to delete" });
    }
  };
  deleteItem();
});

//needed to check if a user is allowed to access some routes(meant for admin only)
const getUserById = async (req) => {
  const user = await User.findById(req.params.userId);
  return user;
};

const getItemById = async (req) => {
  const item = await Item.findById(req.params.itemId);
  return item;
};

module.exports = router;
