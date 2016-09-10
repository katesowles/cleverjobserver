'use strict';

const express = require('express');
const router = express.Router();

const bodyparser = require('../bodyparser');
const ensureAuth = require('../ensureAuth');
const token = require('../token.js');

const User = require('../models/user');

module.exports = router

.post('/signup', bodyparser, (req, res) => {
  const {username, password} = req.body;
  delete req.body.password;

  //add regex for email validity

  if(!username || !password) {
    return res.status(400).json({message: 'Invalid username or password.'});
  }

  User.findOne({username})
    .then(existing => {
      if(existing) return res.status(500).json({message: 'Username already exists.'});
      const user = new User(req.body);
      user.generateHash(password);
      return user.save();
    })
    .then(user => {
      return token.sign(user);

    })
    .then(token => {
      res.json({token});
    })
    .catch(err);
})
.post('/signin', bodyparser, (req, res) => {
  const {username, password} = req.body;
  delete req.body;

  User.findOne({username})
    .then(user => {
      if(!user || !user.compareHash(password)) return res.status(400).json({message: 'Invalid username or password.'});
      return token.sign(user);
    })
    .then(token => {
      res.json({token});
    })
    .catch(err);
});

router.get('/verify', ensureAuth, (req, res) =>{
  res.status(200).send({success: true});
});

module.exports = router;
