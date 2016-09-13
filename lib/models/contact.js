'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    .sort({ createdAt: -1 })
    .then(contacts => {
      if (!contacts) throw {status: 400, message: 'You have no contacts yet.'};
      return contacts;
    });
};

contact.statics.showRecent = function (days) {
  //TODO: will need to parse date on front-end and pass to server as #days
  //TODO: could use select with 'Within Last': One Week, Two Weeks, etc.
  const startTime = moment().subtract(days, 'days');
  const today = moment().startOf('day');
  // const tomorrow = moment(today).add(1, 'days');
  // $gte: today.toDate(),
  // $lt: tomorrow.toDate()
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
    //could instead return a count for charting purposes.
    // return `You've applied for ${contacts.length} contacts in the last ${start} days.`
    return contacts;
  });
};

// {"created_on": {"$gte": new Date(2012, 7, 14), "$lt": new Date(2012, 7, 15)}})
contact.methods.showFollowUpMessage = function () {

};

module.exports = mongoose.model('Contact', contact);
