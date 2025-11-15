// routes/debugRoutes.js - Add these to your cyclone routes or create a separate debug routes file
const express = require("express");
const router = express.Router();
const PredictedTrack = require('../models/PredictedTrack');
const Prediction = require('../models/Prediction');
const { getLatestMergedPrediction, saveMergedPredictionToCyclone } = require('../services/predictionMergeService');

// Check if PredictedTrack collection has data
router.get('/predicted-tracks', async (req, res) => {
  try {
    const count = await PredictedTrack.countDocuments();
    const latest = await PredictedTrack.findOne().sort({ createdAt: -1 });
    
    res.json({
      status: 'success',
      count,
      latest: latest ? {
        id: latest._id,
        cyclone_run: latest.cyclone_run,
        trajectoryPoints: latest.trajectory?.length || 0,
        createdAt: latest.createdAt,
        firstPoint: latest.trajectory?.[0]
      } : null
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Check if Prediction collection has data
router.get('/predictions', async (req, res) => {
  try {
    const count = await Prediction.countDocuments();
    const latest = await Prediction.findOne().sort({ created_at_utc: -1, _id: -1 });
    
    res.json({
      status: 'success',
      count,
      latest: latest ? {
        id: latest._id,
        window_index: latest.window_index,
        probability: latest.probability,
        label: latest.label,
        seq_start: latest.seq_start,
        seq_end: latest.seq_end,
        created_at_utc: latest.created_at_utc
      } : null
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Test the merge function with detailed logging
router.get('/test-merge', async (req, res) => {
  try {
    console.log('=== Testing Merge Function ===');
    const merged = await getLatestMergedPrediction({ persistStates: false });
    
    if (!merged) {
      return res.json({
        status: 'error',
        message: 'Merge returned null',
        hint: 'Check if PredictedTrack collection has data'
      });
    }
    
    res.json({
      status: 'success',
      data: {
        cyclone_run: merged.cyclone_run,
        probability: merged.probability,
        firstPoint: merged.firstPoint,
        firstState: merged.firstState,
        trajectoryPoints: merged.trajectory?.length || 0,
        affectedStatesPreview: merged.trajectory
          ?.slice(0, 5)
          .map(p => ({ lat: p.lat, lng: p.lng, state: p.state }))
      }
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: error.message,
      stack: error.stack 
    });
  }
});

// Test saving cyclone with custom distance
router.post('/test-save-cyclone', async (req, res) => {
  try {
    const { maxDistance } = req.body;
    console.log('=== Testing Save Cyclone ===');
    console.log('Max distance:', maxDistance || 500, 'km');
    
    const cyclone = await saveMergedPredictionToCyclone(maxDistance || 500);
    
    if (!cyclone) {
      return res.json({
        status: 'error',
        message: 'No cyclone created',
        hint: 'Check the merge function output first'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Cyclone created successfully',
      data: cyclone
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: error.message,
      stack: error.stack 
    });
  }
});

module.exports = router;