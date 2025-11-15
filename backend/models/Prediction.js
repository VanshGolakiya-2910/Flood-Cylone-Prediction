// models/Prediction.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const PredictionSchema = new Schema({
  window_index: Number,
  seq_start: Date,
  seq_end: Date,
  probability: Number,
  label: Number,
  model_path: String,
  data_dir: String,
  created_at_utc: Date
});

module.exports = mongoose.model('Prediction', PredictionSchema, 'predictions');
