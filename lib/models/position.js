'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

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
  // actionItems: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'ActionItem'
  // }],
  questions: [String],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

position.statics.findByUser = function (userId) {
  return this.find({user: userId})
    .populate('company')
    .sort({createdAt: -1})
    .then(positions => {
      if (!positions) throw {status: 400, message: 'You have not applied for any positions yet.'};
      return positions;
    });
};

position.statics.positionsAppliedWeek = function (userId) {
  const startTime = moment().startOf('week');
  const today = moment().endOf('day');

  return this.find({
    user: userId,
    dateApplied: {
      $gte: startTime.toDate(),
      $lt: today.toDate()
    }
  })
  .sort({createdAt: -1})
  .then(positions => {
    if (!positions) throw {status: 400, message: 'You have not applied for any positions this week.'};
    return positions;
  });
};

position.statics.showRecent = function (userId/*, days*/) {
  //TODO: should probably allow user to pass in days via options in select element and then set startTime like this
  //  const startTime = moment().subtract(days, 'days');

  const startTime = moment().subtract(7, 'days');
  const today = moment().endOf('day');

  return this.find({
    user: userId,
    dateApplied: {
      $gte: startTime.toDate(),
      $lt: today.toDate()
    }
  })
  .sort({createdAt: -1})
  .then(positions => {
    if (!positions) throw {status: 400, message: 'You have not applied for any positions within the last 7 days.'};
    return positions;
  });
};

module.exports = mongoose.model('Position', position);
