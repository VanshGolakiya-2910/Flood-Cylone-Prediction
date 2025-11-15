// backend/routes/predictedTracks.js
const express = require('express');
const router = express.Router();
const PredictedTrackController = require('../controllers/predictedTrackController');

// Public: fetch merged predicted + probability
router.get('/latest', PredictedTrackController.getLatest);

// Admin: ingest latest predicted into Cyclone collection (optional)
router.post('/ingest-to-cyclone', PredictedTrackController.ingest);

module.exports = router;
