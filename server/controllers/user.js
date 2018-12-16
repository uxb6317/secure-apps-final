const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const io = require("../socket");

const User = require("../models/user");
const Online = require("../models/online");
const Game = require("../models/game");
const Chat = require("../models/chat");

const gameController = require("../controllers/game");

exports.activeUsers = async (req, res, next) => {
  try {
    const onlineUsers = await Online.findById(
      "5c0ed2382a33eb26bc83b2e4"
    ).populate("users", ["name", "challenger"]);

    res.status(201).json({ users: onlineUsers.users });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.challengeUser = async (req, res, next) => {
  const challengerUserId = req.userId;
  const challengerName = req.name;
  const challengedUserId = req.params.userId;

  if (challengerUserId == challengedUserId) {
    const error = new Error("You can't challenge yourself.");
    error.statusCode = 412;
    error.data = errors.array();
    throw error;
  }

  try {
    const user = await User.findById(challengedUserId);
    if (user.challenger != null) {
      const error = new Error(
        "${user.name} is already being challenged by someone."
      );
      error.statusCode = 412;
      error.data = errors.array();
      throw error;
    }

    // set the challenger field for a user
    user.challenger = challengerUserId;
    await user.save();

    // add the challenged user to the challenger's list
    const challengingUser = await User.findById(challengerUserId);
    challengingUser.challenged.addToSet(challengedUserId);
    await challengingUser.save();

    io.getIO().emit("new challenger", {
      name: challengerName,
      userId: challengerUserId,
      challengedUserId
    });

    res.status(200).json({
      challenged: challengingUser.challenged
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// return the list of users you have challenged
exports.getChallenged = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate("challenged", "name");
    let challenged = [];
    if (user.challenged.length > 0) {
      challenged = user.challenged;
    }
    res.status(200).json({ challenged });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.acceptChallenge = async (req, res, next) => {
  const { challengerId } = req.body;

  try {
    // create chat for game
    const chat = new Chat({ global: false });
    const chatResult = await chat.save();

    // create game
    const game = new Game({
      // player1: req.userId,
      // player2: challengerId,
      chat: chatResult._id
    });
    const createdGame = await game.save();

    // set the user's game to the created game
    const user = await User.findById(req.userId);
    user.game = createdGame._id;
    user.challenger = null;

    const acceptedUser = await User.findById(challengerId);
    acceptedUser.game = createdGame._id;
    acceptedUser.challenged.pull(req.userId);

    await user.save();
    await acceptedUser.save();

    io.getIO().emit("challenge accepted", {
      challengerId
    });

    // io.getIO().emit("init game", {
    //   player1: req.userId,
    //   player2: challengerId,
    //   chat: chatResult._id
    // });

    res.status(200).json({ msg: "ACCEPTED" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.denyChallenge = async (req, res, next) => {
  const { deniedId } = req.body;

  try {
    // set the challenger field for the challenged user
    const user = await User.findById(req.userId);
    user.challenger = null;
    await user.save();

    // add the challenged user to the challenger's challenged field
    const deniedUser = await User.findById(deniedId);
    deniedUser.challenged.pull(req.userId);
    await deniedUser.save();

    io.getIO().emit("challenge denied", {
      deniedBy: req.name,
      deniedById: req.userId,
      deniedId
    });

    res.status(201).json({ msg: "DENIED" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
