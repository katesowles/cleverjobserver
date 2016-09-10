'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const company = new Schema({
  name: String,
  service: String,
  location: String,
  info: String,
  tech: String,
  pros: [String],
  cons: [String],
  questions: [String],
  contacts: [{
    type: Schema.Types.ObjectId,
    ref: 'Contact'
  }],
  links: [{
    url: String,
    desc: String
  }],
  actionItems: [{
    date: Date,
    plan: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Company', company);
