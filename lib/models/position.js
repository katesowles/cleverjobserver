'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const position = new Schema({
  title: String,
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company'
  },
  dateAdvertised: Date,
  dateApplied: Date,
  method: String,
  postingInfo: String,
  followups: [{
    date: Date,
    method: String,
    contact: {
      type: Schema.Types.ObjectId,
      ref: 'Company'
    },
    info: String
  }],
  actionItems: [{
    date: Date,
    plan: String
  }],
  questions: [String]
}, { timestamps: true });

module.exports = mongoose.model('Position', position);
