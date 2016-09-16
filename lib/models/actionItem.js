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

ActionItem.statics.findByUser = function (userId) {
  return this.find({
    user: userId,
    completed: false
  })
  .populate('company')
  .populate('position')
  .sort({createdAt: -1})
  .then(actionItems => {
    if (!actionItems) throw {status: 400, message: 'You have no action items at this time.'};
    return actionItems;
  });
};

ActionItem.statics.findByPosOrComp = function (which, id) {
  // if below does not work then add if check
  if (which === 'position') {
    return this.find({position: id})
    .sort({createdAt: -1})
    .populate('company')
    .populate('position')
    .then(actionItems => {
      if (!actionItems) throw {status: 400, message: `You have no action items for that ${which}.`};
      return actionItems;
    });
  } else {
    return this.find({company: id})
    .sort({createdAt: -1})
    .populate('company')
    .populate('position')
    .then(actionItems => {
      if (!actionItems) throw {status: 400, message: `You have no action items for that ${which}.`};
      return actionItems;
    });
  }
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
    }).sort({dateDue: 1})
    .populate('company')
    .populate('position'),
    this.find({
      user: userId,
      dateDue: {
        $gte: today.toDate(),
        $lt: dueTime.toDate()
      }
    }).sort({dateDue: 1})
    .populate('company')
    .populate('position'),
  ])
  .then(([overDue, almostDue]) => {
    if (!overDue && !almostDue) throw {status: 400, message: 'You have no overdue or due action items.'};

    return {overDue, almostDue};
  });
};

ActionItem.statics.getRecent = function () {};

module.exports = mongoose.model('ActionItem', ActionItem);
