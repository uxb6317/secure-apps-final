const Message = require("../models/message");
const Chat = require("../models/chat");

const io = require("../socket");

exports.initGlobal = async (req, res, next) => {
  try {
    const globalChat = await Chat.findOne({ global: true }); // get the id of global chat
    // find messages that were posted in the global chat
    const globalMessages = await Message.find({
      chat: globalChat._id
    }).populate("creator", "name"); // get the message creator's name
    // map over array and make response object
    const messages = globalMessages.map(message => {
      return {
        sender: message.creator.name,
        content: message.content,
        time: message.createdAt,
        id: message._id
      };
    });
    res.status(200).json({ chatId: globalChat._id, messages });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getChat = async (req, res, next) => {
  // this function will get the messages for a game instance
  const chatId = req.params.chatId;

  try {
    // fetch the chat document from DB
    const chat = await Chat.findById(chatId);
    // fetch messages that belong to this chat
    const chatMessages = await Message.find({ chat: chat._id }).populate(
      "creator",
      "name"
    );
    // map over array and make response object
    const messages = chatMessages.map(message => {
      return {
        sender: message.creator.name,
        content: message.content,
        time: message.createdAt,
        id: message._id
      };
    });
    res.status(200).json({ chatId, messages });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postMessage = async (req, res, next) => {
  // name of user from decoded token, i think this would
  // break if the user changed his name. So probably better to
  // retrieve the name from the database instead
  const name = req.name;
  try {
    const message = new Message({
      content: req.body.message,
      creator: req.userId, // reference to user document that posted this message
      chat: req.body.chatId // reference to chat document this message should belong to
    });
    await message.save();

    const responseData = {
      time: message.createdAt,
      content: message.content,
      id: message._id,
      sender: name,
      chatId: message.chat
    };

    io.getIO().emit("new message", {
      responseData
    });

    res.status(201).json({ message: "Message Sent." });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
