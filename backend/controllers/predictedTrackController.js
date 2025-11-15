// backend/controllers/predictedTrackController.js
const { getLatestMergedPrediction, ingestPredictedToCyclone } = require('../services/predictionMergeService');

const getLatest = async (req, res) => {
  try {
    const merged = await getLatestMergedPrediction();
    if (!merged) return res.status(200).json({ status: 'success', data: null, message: 'No predicted tracks' });

    // Build a frontend-friendly payload (example)
    const response = {
      cyclone_run: merged.cyclone_run,
      probability: merged.probability,
      firstPoint: merged.firstPoint,
      state: merged.firstPointState,
      trajectory: merged.trajectory,
      prediction_meta: merged.prediction_meta,
      createdAt: merged.createdAt
    };

    return res.status(200).json({ status: 'success', data: response });
  } catch (err) {
    console.error('getLatest predicted error:', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

const ingest = async (req, res) => {
  try {
    const opts = req.body || {};
    const saved = await ingestPredictedToCyclone(opts);
    return res.status(201).json({ status: 'success', data: saved });
  } catch (err) {
    console.error('ingest predicted error:', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

module.exports = { getLatest, ingest };
    