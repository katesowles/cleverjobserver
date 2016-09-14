'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const ActionItem = new Schema({
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
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  completed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

ActionItem.statics.findByPosOrComp = function (which, id) {
  // if below does not work then add if check
  // if (which === 'position') {
  return this.find({which: id})
  .sort({createdAt: -1})
  .then(positions => {
    if (!positions) throw {status: 400, message: `You have no action items for that ${which}.`};
    return positions;
  });
  // } else {
  //
  // }
};

ActionItem.statics.getOverdueAndDue = function (userId) {
  const dueTime = moment().endOf('day').add(3, 'days');
  const today = moment().endOf('day');
  return Promise.all([
    this.find({
      user: userId,
      dateDue: {
        $lt: today.toDate()
      }
    }).sort({dateDue: 1}),
    this.find({
      user: userId,
      dateDue: {
        $gte: today.toDate(),
        $lt: dueTime.toDate()
      }
    }).sort({dateDue: 1})
  ])
  .then(([overDue, almostDue]) => {
    if (!overDue || !almostDue) throw {status: 400, message: 'You have no overdue or due action items.'};

    return {overDue, almostDue};
  });
};

ActionItem.statics.getRecent = function () {};

module.exports = mongoose.model('ActionItem', ActionItem);
