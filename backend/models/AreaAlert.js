// models/AreaAlert.js
const mongoose = require('mongoose');

const areaAlertSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    title: {
      type: String,
      trim: true,
      default: 'Area Alert'
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    ctaUrl: {
      type: String,
      trim: true,
      default: ''
    },
    subject: {
      type: String,
      trim: true
    },
    recipients: [
      {
        type: String, // store emails of users who received it
        trim: true
      }
    ],
    sentCount: {
      type: Number,
      default: 0
    },
    skippedCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('AreaAlert', areaAlertSchema);
