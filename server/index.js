require("dotenv").config();
const { MongoClient } = require("mongodb");
const express = require("express");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const app = express();
const socketio = require("socket.io");
const server = require("http").Server(app);
const io = require("socket.io")(server);
let onlineUsers = [];
let onlineFriends = [];
let messages = [];

io.on("connection", socket => {
  socket.on("disconnect", data => {
    console.log("a user has lost connection...");
    socket.broadcast.emit("user-disconnect", onlineUsers);
    socket.emit("user-disconnect", onlineUsers);
  });

  socket.on("add-friend", user => {
    let flag = false;
    for (let i = 0; i < onlineUsers.length; i++) {
      if (onlineUsers[i].handle === user) {
        flag = true;
      } else {
        flag = false;
      }
    }
    if (flag === true) {
      socket.emit("friend-check-success", user);
    } else {
      socket.emit("user-not-found");
    }
  });

  socket.on("submit-handle", data => {
    onlineUsers.push(data);
    socket.broadcast.emit("join-lobby", onlineUsers);
    socket.emit("join-lobby", onlineUsers);
  });

  socket.on("request-users", data => {
    socket.emit("get-users", onlineUsers);
    socket.broadcast.emit("update-friends");
  });

  socket.on("client-send-message", data => {
    messages.push({ key: data });
    socket.emit("server-send-message", messages);
    socket.broadcast.emit("server-send-message", messages);
  });

  socket.on("log-out", data => {
    const found = onlineUsers.find(user => {
      return user.handle === data;
    });
    if (found) {
      const newOnlineUsers = onlineUsers.splice(found, 1);
      onlineUsers = newOnlineUsers;
      socket.broadcast.emit("join-lobby", onlineUsers);
      socket.emit("join-lobby", onlineUsers);
    }
  });
});

MongoClient.connect(
  process.env.MONGODB_URI,
  (err, client) => {
    const db = client.db("library");
    const users = db.collection("users");

    app.use(jsonParser);
    app.post("/login", (req, res) => {
      users.findOne(req.body, (err, result) => {
        if (result == null) {
          users.insertOne(req.body, (err, result) => {
            if (err) {
              console.error(err);
              res.sendStatus(500);
            } else {
              res.sendStatus(200);
            }
          });
        } else {
          res.sendStatus(418);
        }
      });
    });

    server.listen(process.env.PORT, () => {
      console.log(`Listening on port ${process.env.PORT}.`);
    });
  }
);
