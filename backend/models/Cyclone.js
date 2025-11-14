// models/Cyclone.js
const mongoose = require('mongoose');
const { getStateFromCoordinates } = require('../utils/geocoding');

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
        time: String,
        state: String
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
      lng: Number,
      state: String
    },
    forecastedRainfall: String,
    status: { type: String, enum: ['Tracking', 'Dissipated', 'Landfall'], default: 'Tracking' },
    alertSended: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Pre-save hook to populate states in trajectory and landfallCoordinates
cycloneSchema.pre('save', async function(next) {
  try {
    // Populate states for trajectory points
    if (this.trajectory && this.trajectory.length > 0) {
      for (const point of this.trajectory) {
        if (point.lat && point.lng && !point.state) {
          try {
            point.state = await getStateFromCoordinates(point.lat, point.lng);
            console.log(`Cyclone [${this.name}] - Populated state for trajectory (${point.lat}, ${point.lng}): ${point.state}`);
          } catch (err) {
            console.error(`Error populating state for trajectory (${point.lat}, ${point.lng}):`, err.message);
            point.state = 'Unknown';
          }
        }
      }
    }

    // Populate state for landfall coordinates
    if (this.landfallCoordinates && 
        this.landfallCoordinates.lat && 
        this.landfallCoordinates.lng && 
        !this.landfallCoordinates.state) {
      try {
        this.landfallCoordinates.state = await getStateFromCoordinates(
          this.landfallCoordinates.lat,
          this.landfallCoordinates.lng
        );
        console.log(`Cyclone [${this.name}] - Populated state for landfall (${this.landfallCoordinates.lat}, ${this.landfallCoordinates.lng}): ${this.landfallCoordinates.state}`);
      } catch (err) {
        console.error(`Error populating state for landfall coordinates:`, err.message);
        this.landfallCoordinates.state = 'Unknown';
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Cyclone = mongoose.model('Cyclone', cycloneSchema);
module.exports = Cyclone;
