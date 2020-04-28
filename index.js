'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const {allocateAndReport} = require('./controllers/allocateButlerController');
const port = 3030;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Route to check status of the server
app.get('/health-check', (req, res) => {
  res.send('Ok!');
});

// Route to allocate butlers to the client
app.post('/allocate-bulters', allocateAndReport);

const server = app.listen(port, () => {
  console.log('listening on port: ', port);
});
