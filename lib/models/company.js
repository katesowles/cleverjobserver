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

module.exports = mongoose.model('Company', company);
