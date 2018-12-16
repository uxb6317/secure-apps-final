const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  global: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model("Chat", chatSchema);
