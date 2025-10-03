import mongoose from 'mongoose';

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
        lng: Number
      }
    ],
    waterLevel: String,
    dangerMark: String,
    estimatedPeople: String
  },
  { timestamps: true }
);

const Flood = mongoose.model('Flood', floodSchema);
export default Flood;
