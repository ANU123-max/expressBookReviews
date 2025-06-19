const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');

let users = require('../users.json');
const router = express.Router();
const SECRET = 'jwtsecret';

router.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (users[username]) return res.status(400).send('User exists');
  users[username] = { password };
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
  res.send('User registered.');
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username]?.password === password) {
    const token = jwt.sign({ username }, SECRET);
    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

module.exports = router;
