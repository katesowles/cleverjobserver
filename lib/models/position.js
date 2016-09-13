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
    // contact: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'Company'
    // },
    info: String
  }],
  actionItems: [{
    date: Date,
    plan: String
  }],
  questions: [String],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

position.statics.findByUser = function (userId) {
  return this.find({user: userId})
    .sort({ createdAt: -1 })
    .then(positions => {
      if (!positions) throw {status: 400, message: 'You have no positions yet.'};
      return positions;
    });
};

module.exports = mongoose.model('Position', position);
