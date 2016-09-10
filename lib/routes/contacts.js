'use strict';

const express = require('express');
const router = express.Router();

const bodyparser = require('../bodyparser');
// const checkAuth = require('../auth/checkAuth')();

const Contact = require('../models/contact');

module.exports = router

.get('', (req,res,next) => {
  Contact.find()
  .lean()
  .then ( contacts => res.send(contacts) )
  .catch( err => {
    console.log('error getting full contact list');
    console.log(err);
    next(err);
  });
})

.get('/:id', (req,res,next) => {
  Contact.findById(req.params.id)
  .lean()
  .then( contact => res.send(contact) )
  .catch( err => {
    console.log('error getting an contact by id');
    console.log(err);
    next(err);
  });
})

.post('', bodyparser, (req,res,next) => {
  new Contact(req.body)
  .save()
  .then( contact => res.send(contact) )
  .catch( err => {
    console.log('error creating a new contact');
    console.log(err);
    next(err);
  });
})

.put('', bodyparser, (req,res,next) => {
  Contact.findByIdAndUpdate(req.params.id, req.body, {new:true})
  .then( contact => res.send(contact) )
  .catch( err => {
    console.log('error updating a contact');
    console.log(err);
    next(err);
  });
})

;
