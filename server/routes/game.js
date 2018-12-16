const express = require("express");

const isAuth = require("../middlewares/isAuth");
const User = require("../models/user");

const gameController = require("../controllers/game");

const router = express.Router();

router.post("/getGame", gameController.getGame);

module.exports = router;
