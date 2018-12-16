const express = require("express");

const isAuth = require("../middlewares/isAuth");

const User = require("../models/user");
const Message = require("../models/message");
const Chat = require("../models/chat");

const chatController = require("../controllers/chat");

const router = express.Router();

// /chat/postMessage
router.post("/postMessage", isAuth, chatController.postMessage);

// /chat/global
router.get("/global", chatController.initGlobal);

router.get("/gameChat/:chatId", chatController.getChat);

module.exports = router;
