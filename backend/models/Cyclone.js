// models/Cyclone.js
const mongoose = require('mongoose');

const trajectoryPointSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  time: Date,
  state: String
}, { _id: false });


const cycloneSchema = new mongoose.Schema(
  {
    probability: { type: Number, required: true },
    firstPoint: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      time: Date
    },
    affectedStates: {
      type: [String],
      default: []
    },
        trajectory: {
      type: [trajectoryPointSchema],
      default: []
    },

  },
  { timestamps: true }
);

const Cyclone = mongoose.model('Cyclone', cycloneSchema);
module.exports = Cyclone;