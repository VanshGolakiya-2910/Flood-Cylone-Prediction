const mongoose = require('mongoose');
const { getStateFromCoordinates } = require('../utils/geocoding');

const floodSchema = new mongoose.Schema(
  {
    region: { type: String, required: true },
    country: { type: String, default: 'India' },
    severity: { type: String, enum: ['Critical', 'High', 'Moderate', 'Low']},
    message: { type: String, required: true },
    issued: { type: Date, default: Date.now },
    affected: { type: Number, default: 0 },
    risk: { type: String, enum: ['High', 'Moderate', 'Low'], default: 'Low' },
    status: { type: String, enum: ['Active', 'Cleared'], default: 'Active' },
    forecastedRainfall: String,
    landCoordinates: [
      {
        lat: Number,
        lng: Number,
        state: String
      }
    ],
    waterLevel: String,
    dangerMark: String,
    estimatedPeople: String,
    alertSended: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Pre-save hook to populate states in landCoordinates
floodSchema.pre('save', async function(next) {
  try {
    if (this.landCoordinates && this.landCoordinates.length > 0) {
      for (const coord of this.landCoordinates) {
        if (coord.lat && coord.lng && !coord.state) {
          try {
            coord.state = await getStateFromCoordinates(coord.lat, coord.lng);
            console.log(`Flood [${this.region}] - Populated state for coordinate (${coord.lat}, ${coord.lng}): ${coord.state}`);
          } catch (err) {
            console.error(`Error populating state for coordinate (${coord.lat}, ${coord.lng}):`, err.message);
            coord.state = 'Unknown';
          }
        }
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Flood = mongoose.model('Flood', floodSchema);
module.exports = Flood;
