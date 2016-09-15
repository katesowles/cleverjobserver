'use strict';

const express = require('express');
const router = express.Router();

const bodyparser = require('../bodyparser');
// const checkAuth = require('../auth/checkAuth')();

const ActionItem = require('../models/actionItem');
// const ActionItem = require('../models/actionItem');
//const Company = require('../models/company');

module.exports = router

.get('', (req,res,next) => {
  ActionItem.find()
  .lean()
  .populate('company')
  .then ( actionItems => res.send(actionItems) )
  .catch( err => {
    console.log('error getting full actionItem list');
    console.log(err);
    next(err);
  });
})

.get('/:id', (req,res,next) => {
  ActionItem.findById(req.params.id)
  .populate('company')
  .populate('position')
  .lean()
  .then( actionItem => res.send(actionItem) )
  .catch( err => {
    console.log('error getting an actionItem by id');
    console.log(err);
    next(err);
  });
})

.get('/byUser/:userId/overdue', (req, res, next) => {
  ActionItem.getOverdueAndDue(req.params.userId)
  .then(actionItems => {
    return ActionItem.populate(actionItems, {path: 'company', path: 'position'});
  })
  .then(actionItems => res.send(actionItems))
  .catch(err => {
    console.log(err);
    next(err);
  });
})

.get('/byUser/:userId', (req, res, next) => {
  ActionItem.findByUser(req.params.userId)
  // .populate('company')
  // .populate('position')
  // .then(actionItems => {
  //   return ActionItem.populate(actionItems, {path: 'company', path: 'position'});
  // })
  .then(actionItems => res.send(actionItems))
  .catch(err => {
    console.log(err);
    next(err);
  });
})

.get('/byPosOrComp/:id/:which', (req, res, next) => {
  console.log(req.params.which);
  ActionItem.findByPosOrComp(req.params.which, req.params.id)
  // .then(actionItems => {
  //   return ActionItem.populate(actionItems, {path: 'company'});
  // })
  .then(actionItems => res.send(actionItems))
  .catch(err => {
    console.log(err);
    next(err);
  });
})

.post('/:id/:userId', bodyparser, (req, res, next) => {
  req.body.position = req.params.id;
  if (req.body.company === '') {delete req.body.company;}
  new ActionItem(req.body)
   .save()
   .then( actionItem => {
     return ActionItem.populate(actionItem, {path: 'position'});
   })
   .then(actionItem => {
     return ActionItem.populate(actionItem, {path: 'company'});
   })
   .then( actionItem => res.send(actionItem) )
   .catch( err => {
     console.log('error creating a new actionItem');
     next(err);
   });
})

.post('/company/:id', bodyparser, (req, res, next) => {
  req.body.company = req.params.id;
  if (req.body.position === '') {delete req.body.position;}
  new ActionItem(req.body)
   .save()
   .then( actionItem => {
     return ActionItem.populate(actionItem, {path: 'company'});
   })
   .then( actionItem => res.send(actionItem) )
   .catch( err => {
     console.log('error creating a new actionItem');
     next(err);
   });
})

.put('', bodyparser, (req,res,next) => {
  ActionItem.findByIdAndUpdate(req.params.id, req.body, {new:true})
  .populate('company')
  .then( actionItem => res.send(actionItem) )
  .catch( err => {
    console.log('error updating a actionItem');
    console.log(err);
    next(err);
  });
})

.delete('/:id', (req,res,next) => {
  ActionItem.findByIdAndRemove(req.params.id)
  .then( actionItem => res.send(actionItem) )
  .catch( err => {
    console.log('error getting an actionItem by id');
    console.log(err);
    next(err);
  });
})
;
