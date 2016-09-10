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
  info: String
}, { timestamps: true });

module.exports = mongoose.model('Contact', contact);
