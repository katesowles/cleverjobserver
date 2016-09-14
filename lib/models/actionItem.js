'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const actionitem = new Schema({
  dateAdded: Date,
  dateDue: Date,
  action: String,
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company'
  },
  position: {
    type: Schema.Types.ObjectId,
    ref: 'Position'
  },
  completed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

actionitem.statics.getOverdue = function () {
  const startTime = moment().endOf('day').subtract(3, 'days');
  const today = moment().endOf('day');
  return Promise.all([
    this.find({
      dateDue: {
        $lt: today.toDate()
      }
    }).sort({dateDue: 1}),
    this.find({
      dateDue: {
        $gte: startTime.toDate(),
        $lt: today.toDate()
      }
    }).sort({dateDue: 1})
  ])
  .then(([overDue, almostDue]) => {
    if (!overDue || !almostDue) throw {status: 400, message: 'You have no overdue or due action items.'};

    return {overDue, almostDue};
  });
};

actionitem.statics.getRecent = function () {};

module.exports = mongoose.model('actionitem', actionitem);
