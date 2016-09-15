'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const user = new Schema({
  name: String,
  email: String,
  password: String,
  lastApplied: Date,
  lastContact: Date,
  positionGoal: Number,
  contactGoal: Number,
  lastLogged: Date,
  role: {type: String, default: 'user'},
  active: {type: Boolean, default: true}
}, { timestamps: true });

user.methods.generateHash = function(password){
  return this.password = bcrypt.hashSync(password, 8);
};

user.methods.compareHash = function(password){
  return bcrypt.compareSync(password, this.password);
};

//TODO: need to figure out user signup flow - user should be setting up initial
//goals, or optionally could skip and default settings could be put in place

//applications sent
//contacts made
//GitHub Activity - would need to make call to GitHub api


// user.statics.anotherMethod = function () {};
//
// user.statics.incrementAppCount = function () {};
//
// user.statics.incrementContactCount = function () {};
//
// user.statics.contactCount = function () {};
//
// user.statics.applicationCount = function() {};

module.exports = mongoose.model('User', user);
