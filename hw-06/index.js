const socket = require("socket.io");
const http = require("http");
const fs = require("fs");
const path = require("path");

const usersPool = [];

const server = http.createServer((req, res) => {
  const indexPath = path.join(__dirname, "index.html");
  const readStream = fs.createReadStream(indexPath);

  readStream.pipe(res);
});

const io = socket(server);
io.on("connection", (client) => {
  // sending a message
  const broadcastMessage = (user, message) => {
    client.broadcast.emit("server-msg", {
      user: user,
      message: message,
    });
    client.emit("server-msg", {
      user: user,
      message: message,
    });
  };

  // users block
  // connect
  const userId = client.id;

  client.on("user-connect", (userName) => {
    if (!!userName && !!!usersPool.find((pool) => pool.user === userName)) {
      broadcastMessage("ChatBOT", `User ${userName} is here! Welcome!`);
      usersPool.push({ id: userId, user: userName });
      client.broadcast.emit("server-users-connected", usersPool);
      client.emit("server-users-connected", usersPool);
    } else if (
      !!userName &&
      !!usersPool.find((pool) => pool.user === userName)
    ) {
      broadcastMessage(
        "ChatBOT",
        `User ${userName} clone is here! For your comfort we'll name him ${
          userName + "'"
        }`
      );
      usersPool.push({ id: userId, user: userName + "'" });
      client.broadcast.emit("server-users-connected", usersPool);
      client.emit("server-users-connected", usersPool);
    }
  });
  // reconnect
  client.on("user-reconnect", (userName) => {
    broadcastMessage("ChatBOT", `User ${userName} is back!`);
    usersPool.push({ id: userId, user: userName });
    client.broadcast.emit("server-users-connected", usersPool);
    client.emit("server-users-connected", usersPool);
  });
  // disconnect
  client.on("disconnect", () => {
    const foundUser = usersPool.find((pool) => pool.id === client.id);
    if (!!foundUser) {
      broadcastMessage(
        "ChatBOT",
        `User ${foundUser.user} has left the building!`
      );
      usersPool.splice(usersPool.indexOf(foundUser), 1);
      client.broadcast.emit("server-users-connected", usersPool);
      client.emit("server-users-connected", usersPool);
    }
  });
  // end of users block

  client.on("client-msg", (data) => {
    const payload = {
      user: data.user,
      message: data.message,
    };
    client.broadcast.emit("server-msg", payload);
    client.emit("server-msg", payload);
  });
});

server.listen(5555);
