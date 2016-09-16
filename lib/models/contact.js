'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const contact = new Schema({
  name: String,
  email: String,
  phone: String,
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company'
  },
  role: String,
  info: String,
  dateMet: Date,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

contact.statics.findByUser = function (userId) {
  return this.find({user: userId})
    .populate('company')
    .sort({ createdAt: -1 })
    .then(contacts => {
      if (!contacts) throw {status: 400, message: 'You have no contacts yet.'};
      return contacts;
    });
};

contact.statics.contactsMadeWeek = function (userId) {
  const startTime = moment().startOf('week');
  const endOfToday = moment().endOf('week');

  return this.find({
    user: userId,
    dateMet: {
      $gte: startTime.toDate(),
      $lt: endOfToday.toDate()
    }
  })
  .sort({createdAt: -1})
  .then(contacts => {
    if (!contacts) throw {status: 400, message: 'You have not made any contacts this week.'};
    return contacts;
  });
};

contact.statics.showRecent = function (days) {
  //TODO: will need to parse date on front-end and pass to server as #days
  //TODO: could use select with 'Within Last': One Week, Two Weeks, etc.
  const startTime = moment().subtract(days, 'days');
  const today = moment().startOf('day');
  return this.find({
    user: userId,
    dateMet: {
      $gte: startTime.toDate(),
      $lt: today.toDate()
    }
  })
  .sort({createdAt: -1})
  .then(contacts => {
    if (!contacts) throw {status: 400, message: `You have not connected with any contacts within the last ${start} days.`};
    return contacts;
  });
};

contact.methods.showFollowUpMessage = function () {

};

module.exports = mongoose.model('Contact', contact);
