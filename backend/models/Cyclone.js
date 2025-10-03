// models/Cyclone.js
import mongoose from 'mongoose';

const cycloneSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    region: { type: String, required: true },
    country: { type: String, default: 'India' },
    severity: { type: String, enum: ['Severe', 'Moderate', 'Low'], required: true },
    message: { type: String, required: true },
    issued: { type: String, default: 'Just now' },
    windSpeed: String,
    eta: String,
    risk: String,
    affected: { type: Number, default: 0 },
    trajectory: [
      {
        lat: Number,
        lng: Number,
        time: String
      }
    ],
    windGusts: [
      {
        lat: Number,
        lng: Number,
        speed: Number
      }
    ],
    landfallCoordinates: {
      lat: Number,
      lng: Number
    },
    forecastedRainfall: String,
    status: { type: String, enum: ['Tracking', 'Dissipated', 'Landfall'], default: 'Tracking' }
  },
  { timestamps: true }
);

const Cyclone = mongoose.model('Cyclone', cycloneSchema);
export default Cyclone;
