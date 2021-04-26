require('dotenv').config();
const axios = require('axios');
const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/static/index.html'));
});

app.get('/auth', (req, res) => {
  res.redirect(
    `https://facebook.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID_FB}`,
  );
});

app.get('/oauth-callback', ({ query: { code } }, res) => {
  const body = {
    client_id: process.env.CLIENT_ID_FB,
    client_secret: process.env.CLIENT_SECRET_FB,
    code,
  };
  const opts = { headers: { accept: 'application/json' } };
  axios
    .post('https://facebook.com/login/oauth/access_token', body, opts)
    .then((_res) => _res.data.access_token)
    .then((token) => {
      
      console.log('My token:', token);

      res.redirect(`/?token=${token}`);
    })
    .catch((err) => res.status(500).json({ err: err.message }));
});

app.listen(3000);


console.log('App listening on port 3000');