'use strict';

const express = require('express');
const router = express.Router();

const bodyparser = require('../bodyparser');
// const checkAuth = require('../auth/checkAuth')();

const Position = require('../models/position');
// const ActionItem = require('../models/actionItem');
//const Company = require('../models/company');

module.exports = router

.get('', (req,res,next) => {
  Position.find()
  .lean()
  .populate('company')
  .then ( positions => res.send(positions) )
  .catch( err => {
    console.log('error getting full position list');
    console.log(err);
    next(err);
  });
})

.get('/:id', (req,res,next) => {
  Position.findById(req.params.id)
  .lean()
  .populate('company')
  .then( position => res.send(position) )
  .catch( err => {
    console.log('error getting an position by id');
    console.log(err);
    next(err);
  });
})

.get('/byUser/:userId/weekly', (req, res, next) => {
  Position.positionsAppliedWeek(req.params.userId)
  .then(positions => res.send(positions))
  .catch(err => {
    console.log('error getting positions applied to this week');
    console.log(err);
    next(err);
  });
})

.get('/byUser/:userId', (req, res, next) => {
  Position.findByUser(req.params.userId)
  .then(positions => res.send(positions))
  .catch(err => {
    console.log(err);
    next(err);
  });
})

.post('/:userId', bodyparser, (req, res, next) => {
  req.body.user = req.params.userId;
  new Position(req.body)
   .save()
   .then( position => {
     return Position.populate(position, {path: 'company'});
   })
   .then( position => res.send(position) )
   .catch( err => {
     console.log('error creating a new position');
     next(err);
   });
})

.put('/:id', bodyparser, (req,res,next) => {
  Position.findByIdAndUpdate(req.params.id, req.body, {new:true})
  .populate('company')
  .then( position => res.send(position) )
  .catch( err => {
    console.log('error updating a position');
    console.log(err);
    next(err);
  });
})

;
