const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  challenged: [{ type: Schema.Types.ObjectId, ref: "User" }],
  challenger: { type: Schema.Types.ObjectId, ref: "User" },
  game: { type: Schema.Types.ObjectId, ref: "Game" }
});

module.exports = mongoose.model("User", userSchema);
