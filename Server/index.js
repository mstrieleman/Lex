require('dotenv').config({ path: '/Users/michael/LEX-CHAT/LEX/.env' });
const { MongoClient } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const app = express();
const socketio = require('socket.io');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const onlineUsers = [];

MongoClient.connect(process.env.MONGODB_URI, (err, client) => {
  const db = client.db('library');
  const users = db.collection('users');

  app.use(jsonParser);
  app.post('/login', (req, res) => {
    users.findOne(req.body, (err, result) => {
      if (result == null) {
        onlineUsers.push(req.body.username);
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

  io.on('connection', socket => {
    socket.join('lobby');
    socket.emit('users', onlineUsers);
    console.log('A client joined on', socket.id);

    socket.on('disconnect', function() {
      console.log(socket.id + ' has disconnected');
      io.emit('user disconnected');
    });
  });

  const PORT = process.env.PORT;
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}.`);
  });
});
