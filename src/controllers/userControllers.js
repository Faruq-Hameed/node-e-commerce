const router = require("express").Router();
const { User, Cart } = require("../db/models");
//import all the modules in the utils folder
const {
  doesUserExist,
  doesUserInfoExist,
  signUpSchema,
  userPutMethodSchema,
  paginate,
  paginationError,
} = require("../utils/");

/**Get all users controller */
const getAllUsers = async (req, res) => {
  try {
    for (let i = 1; i < 20; i++) {
User.create({
  email: `user${i}@example.com`,
        userName: `user${i}`,
        firstName: `fName${i}`,
        lastName: `lName${i}`,
        mobileNumber: `${i}234567`,
        password: "password",
        birthYear: `1905`
})
    }
    const limit = 1 * req.query.limit; //to ensure an integer is returned
    const allUsers = await User.find({}).limit(limit);

    // //paginating the results to be returned to the user
    // const error = paginationError(allUsers, req);
    // if (error) {
    //   res.status(error.status).json({ message: error.message });
    //   return;
    // }
    // const paginatedUsersList = paginate(allUsers, req);

    res.status(200).json(allUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = getAllUsers

router.get("/:userId", (req, res) => {
  const getUserById = async () => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        res.status(410).send({ message: "user account already deleted" }); //incase null was returned
        return;
      }
      res.status(200).send({ user });
    } catch (err) {
      res.status(401).send("unknown user");
      return;
    }
  };
  getUserById();
});

//search for user with email, username or mobile number
router.get("/user/search/", (req, res) => {
  const getUserById = async () => {
    const value = req.query.email
      ? { email: req.query.email }
      : req.query.userName
      ? { userName: req.query.userName }
      : req.query.mobileNumber
      ? { mobileNumber: req.query.mobileNumber }
      : false;
    const user = await User.findOne(value);
    if (!user) {
      res.status(404).send({ message: "no user with found" });
      return;
    }
    res.status(200).send({ user });
  };
  getUserById();
});

router.post("/", (req, res) => {
  //validating the user inputs with joi schema
  const validation = signUpSchema(req.body);
  if (validation.error) {
    res.status(422).send(validation.error.details[0].message);
    return;
  }

  const signUp = async () => {
    try {
      //checking if the values are not already in the database
      const itemExist = await doesUserExist(
        User,
        validation.value,
        "email",
        "userName",
        "mobileNumber"
      );
      if (itemExist) {
        return res
          .status(itemExist.status)
          .json({ message: itemExist.message });
      }

      //storing the validated objects to the database
      const newUser = await User.create(validation.value);
      const newUserCart = await Cart.create({ _id: newUser._id });
      const password = await Password.create({
        password: await securePassword(validation.value.password),
        user_id: newUser._id,
      });
      res.status(200).json({
        userSummary: newUser,
        password: password,
        newUserCart: newUserCart,
      });
    } catch (err) {
      res.status(400).send(err.message);
    }
  };
  //calling the async function for the signup process
  signUp();
});

router.put("/:userId", (req, res) => {
  const getUserById = async () => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        res.status(410).send({ message: "user account already deleted" }); //incase null was returned
        return;
      }

      const validation = userPutMethodSchema(req.body);
      if (validation.error) {
        res.status(422).send(validation.error.details[0].message);
        return;
      }
      const itemExist = await doesUserInfoExist(
        user,
        User,
        validation.value,
        "email",
        "userName",
        "mobileNumber"
      );

      if (itemExist) {
        //if we already have user that matches the email,username or mobileNumber
        return res
          .status(itemExist.status)
          .json({ message: itemExist.message });
      }

      //using a loop to check through the keys and update to the validated value submitted by the user
      for (keys in validation.value) {
        user[keys] = validation.value[keys];
      }
      user.save();
      return res.status(200).send({ user });
    } catch (err) {
      res.status(401).send("unknown user");
      return;
    }
  };
  getUserById();
});

router.delete("/:userId", (req, res) => {
  const deleteUser = async () => {
    try {
      const user = await User.findByIdAndDelete(req.params.userId);
      if (user) {
        res.status(200).send({ message: "delete successfully", user: user });
        return;
      }
      res.status(410).send({ message: "user account already deleted" }); //incase null was returned
    } catch (err) {
      return res.status(401).send("unknown user");
    }
  };
  deleteUser();
  // //const userCart = allUsersOrders.find(user => user.userId === req.params.userId)// former logic
  // const userCart = getUser(allUsersOrders, req.params.userId)
  // users.splice(userIndex, 1) // remove the user from the list(database)
  // userCart.userOrders.length = 0 //emptying the user cart for all orders but the user cart is still present
  // res.status(200).send("delete successfully, your cart is emptied we hope to see you again")
});

// module.exports = router;
