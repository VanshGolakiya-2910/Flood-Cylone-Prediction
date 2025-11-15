// models/PredictedTrack.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const TrajPoint = new Schema({
  lat: Number,
  lng: Number,
  time: Date
}, { _id: false });

const PredictedTrackSchema = new Schema({
  cyclone_run: String,
  trajectory: [TrajPoint],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PredictedTrack', PredictedTrackSchema, 'predicted_tracks');
