'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
  name: String,
  login: String,
  hash: String,
  positions: [{
    type: Schema.Types.ObjectId,
    ref: 'Position'
  }],
  companies: [{
    type: Schema.Types.ObjectId,
    ref: 'Company'
  }],
  contacts: [{
    type: Schema.Types.ObjectId,
    ref: 'Contact'
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', user);
