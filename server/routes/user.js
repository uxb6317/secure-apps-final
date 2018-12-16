const express = require("express");
const { body } = require("express-validator/check");

const User = require("../models/user");
const userController = require("../controllers/user");
const isAuth = require("../middlewares/isAuth");

const router = express.Router();

// router.get("/getChallenger", isAuth, userController.getChallenger);

router.get("/challenge/getChallenged", isAuth, userController.getChallenged);

router.get("/challenge/:userId", isAuth, userController.challengeUser);

router.post("/challenge/deny", isAuth, userController.denyChallenge);

router.post("/challenge/accept", isAuth, userController.acceptChallenge);

router.get("/active_users", userController.activeUsers);

module.exports = router;
