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
  actionItems: [{
    date: Date,
    plan: String
  }],
  questions: [String]
}, { timestamps: true });

position.statics.findByUser = function (userId) {
  return this.find({user: userId})
    .sort({createdAt: -1})
    .then(positions => {
      if (!positions) throw {status: 400, message: 'You have not applied for any positions yet.'};
      return positions;
    });
};

position.statics.showRecent = function (days) {
  //TODO: will need to parse date on front-end and pass to server as #days
  //TODO: could use select with 'Within Last': One Week, Two Weeks, etc.
  const startTime = moment().subtract(days, 'days');
  const today = moment().startOf('day');
  // const tomorrow = moment(today).add(1, 'days');
  // $gte: today.toDate(),
  // $lt: tomorrow.toDate()
  return this.find({
    user: userId,
    dateApplied: {
      $gte: startTime.toDate(),
      $lt: today.toDate()
    }
  })
  .sort({createdAt: -1})
  .then(positions => {
    if (!positions) throw {status: 400, message: `You have not applied for any positions within the last ${start} days.`};
    //could instead return a count for charting purposes.
    // return `You've applied for ${positions.length} positions in the last ${start} days.`
    return positions;
  });
};

// {"created_on": {"$gte": new Date(2012, 7, 14), "$lt": new Date(2012, 7, 15)}})
position.methods.showFollowUpMessage = function () {

};

module.exports = mongoose.model('Position', position);
