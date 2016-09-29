'use strict';

const express = require('express');
const router = express.Router();

const bodyparser = require('../bodyparser');
const ensureAuth = require('../ensureAuth');
const token = require('../token.js');

const User = require('../models/user');

module.exports = router

.post('/signup', bodyparser, (req, res) => {
  const {email, password, name} = req.body;
  delete req.body.password;

  //add regex for email validity

  if(!email || !password || !name) {
    // NOTE: Sending back an error state seems to prevent sending a
    //  useful error message. So don't send an error state.
    return res.json({message: 'All fields are required.'});
  }

  User.findOne({email})
    .then(existing => {
      if(existing) return res.status(500).json({message: 'That email is already in use.'});
      const user = new User(req.body);
      user.generateHash(password);
      return user.save()
      .then(user => {
        return token.sign(user);
      })
      .then(token => {
        res.json({token});
      });
    })
    .catch( err => {
      console.log('error on user signup');
      console.log(err);
      next(err);
    });
})

.post('/signin', bodyparser, (req, res) => {
  const {email, password} = req.body;
  delete req.body;

  User.findOne({email})
    .then( user => {
      if(!user || !user.compareHash(password)) {
        // NOTE: Sending back an error state seems to prevent sending a
        //  useful error message. So don't send an error state.
        return res.json({error:'Invalid email or password.'});
      }
      return token.sign(user)
      .then(token => {
        res.json({token});
      });
    })
    .catch( err => {
      console.log('error on user signin');
      console.log(err);
      next(err);
    });
})

.get('/verify', ensureAuth, (req, res) =>{
  res.status(200).send({success: true, role: req.user.role});
})

;
