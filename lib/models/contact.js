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

module.exports = mongoose.model('Contact', contact);
