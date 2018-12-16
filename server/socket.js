let io;
let users = [];

module.exports = {
  init: httpServer => {
    io = require("socket.io").listen(httpServer);
    return io;
  },

  getIO: () => {
    if (!io) {
      throw new Error("socket.io is not initialized.");
    }
    return io;
  }
};
