'use strict';
const moment = require('moment');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const company = new Schema({
  name: String,
  service: String,
  location: String,
  info: String,
  tech: String,
  pros: [{pro: String}],
  cons: [{con: String}],
  questions: [{question: String}],
  contacts: [{
    type: Schema.Types.ObjectId,
    ref: 'Contact'
  }],
  links: [{
    url: String,
    desc: String
  }],
  actionItems: [{
    type: Schema.Types.ObjectId,
    ref: 'ActionItem'
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

company.statics.findByUser = function (userId) {
  return this.find({user: userId})
    .sort({ createdAt: -1 })
    .then(companies => {
      if (!companies) throw {status: 400, message: 'You have no companies yet.'};
      return companies;
    });
};

company.statics.companiesAppliedWeek = function (userId) {
  const startTime = moment().startOf('week');
  const today = moment().endOf('week');

  return this.find({
    user: userId,
    createdAt: {
      $gte: startTime.toDate(),
      $lt: today.toDate()
    }
  })
  .sort({createdAt: -1})
  .then(companies => {
    if (!companies) throw {status: 400, message: 'You have not applied for any companies this week.'};
    return companies;
  });
};

module.exports = mongoose.model('Company', company);
