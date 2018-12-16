const Game = require("../models/game");
const User = require("../models/user");

const io = require("../socket");

exports.getGame = async (req, res, next) => {
  const userId = req.body.userId;
  const user = await User.findById(userId).populate("game");
  const game = user.game;
  res.status(200).json({ game });
};
