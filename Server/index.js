require('dotenv/config');
const { MongoClient } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

MongoClient.connect(process.env.MONGODB_URI, (err, client) => {
  const app = express();
  const db = client.db('library');
  const users = db.collection('users');

  app.use(jsonParser);
  app.post('/login', (req, res) => {
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

  app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}.`);
  });
});
