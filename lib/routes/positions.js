'use strict';

const express = require('express');
const router = express.Router();

const bodyparser = require('../bodyparser');
// const checkAuth = require('../auth/checkAuth')();

const Position = require('../models/position');
//const Company = require('../models/company');

module.exports = router

.get('', (req,res,next) => {
  Position.find()
  .lean()
  .populate('position')
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
  .populate('position')
  .then( position => {
    console.log(position);
    res.send(position) ;
  })
  .catch( err => {
    console.log('error getting an position by id');
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
  .then( position => res.send(position) )
  .catch( err => {
    console.log('error creating a new position');
    console.log(err);
    next(err);
  });
})

.delete('/:id', (req, res, next) => {
  Position.findByIdAndRemove(req.params.id)
  .then(deletedPosition => res.send(deletedPosition) )
  .catch(next);
})

.put('/:id', bodyparser, (req,res,next) => {
  Position.findByIdAndUpdate(req.params.id, req.body, {new:true})
  .populate('position')
  .then( position => res.send(position) )
  .catch( err => {
    console.log('error updating a position');
    console.log(err);
    next(err);
  });
})

;
