const express = require("express");
const bodyP = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const mySocket = require("./socket");

const app = express();

const isAuth = require("./middlewares/isAuth");

const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const gameRoutes = require("./routes/game");

app.use(bodyP.json()); // parse JSON

app.use((req, res, next) => {
  // res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.end();
  }

  next();
});

// app.use(cors());
// app.use(cors(corsOptions));

app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);
app.use("/game", gameRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect("")
  .then(() => {
    const server = http.Server(app);
    const io = mySocket.init(server);
    server.listen(8080);
    io.on("connection", socket => {
      console.log(`client connected with id: ${socket.id}`);
    });
  })
  .catch(err => console.log(err));
