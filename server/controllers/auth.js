const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const io = require("../socket");

const User = require("../models/user");
const Online = require("../models/online");

exports.login = async (req, res, next) => {
  const { email, password } = req.body; // get email and password from request body
  try {
    const user = await User.findOne({ email })
      .populate("challenger", "name")
      .populate("challenged", "name"); // look for user in the db
    if (!user) {
      // if user is empty
      const error = new Error("User with this email doesn't exist.");
      console.log("User with this email doesn't exist.");
      error.statusCode = 402;
      throw error;
    }
    // user is found and exists
    const isEqual = await bcrypt.compare(password, user.password); // compare passwords
    if (!isEqual) {
      // password doesn't match
      const error = new Error("Wrong password.");
      console.log("Wrong password.");
      error.statusCode = 402;
      throw error;
    }
    // everything is good and user has logged in
    const onlineUsers = await Online.findById("5c0ed2382a33eb26bc83b2e4");
    onlineUsers.users.addToSet(user._id);
    await onlineUsers.save();

    const name = user.name;
    userId = user._id.toString();

    // create token
    const token = jwt.sign(
      {
        email: user.email,
        name,
        userId
      },
      "mysecretsecret",
      { expiresIn: "1h" }
    );

    io.getIO().emit("add user", {
      userId,
      name
    });

    let challenger = null;
    if (user.challenger != null) {
      challenger = { name: user.challenger.name, userId: user.challenger._id };
    }

    let challenged = [];
    if (user.challenged.length > 0) {
      challenged = user.challenged;
    }

    // return json to client
    res.status(200).json({
      message: "login successful",
      name,
      token,
      userId,
      challenger,
      challenged
    });

    // catch any errors
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  const { userId } = req;

  const onlineUsers = await Online.findById("5c0ed2382a33eb26bc83b2e4");
  onlineUsers.users.pull(userId);
  await onlineUsers.save();

  io.getIO().emit("remove user", { userId }); // socket event

  res.status(201).json({ message: "logged out" });
};

exports.signup = async (req, res, next) => {
  const errors = validationResult(req); // errors from the previous middleware, express-validator
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation Failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    } else {
      const { name, email, password } = req.body; // get input info from request
      const hashedPassword = await bcrypt.hash(password, 12); // hash the password
      const user = new User({
        name,
        email,
        password: hashedPassword
      }); // create a new User
      await user.save(); // save the user to the DB

      // send json response to client
      res.status(201).json({
        message: "Signup Success!"
        // id: result._id.toString()
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
