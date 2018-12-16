const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  // player1: { type: Schema.Types.ObjectId, ref: "User", required: true },
  // player2: { type: Schema.Types.ObjectId, ref: "User", required: true },
  chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
  board: { type: [[]], required: true }
});

module.exports = mongoose.model("Game", gameSchema);
