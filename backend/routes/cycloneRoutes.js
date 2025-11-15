// routes/cycloneRoutes.js
const express = require("express");
const router = express.Router();
const {
  getCyclone,
  createCycloneFromPrediction,
  getCycloneById,
  deleteCyclone,
  deleteAllCyclones
} = require("../controllers/cycloneController");

// Get all cyclones or latest cyclone
// Query: ?latest=true or ?limit=10
router.get("/", getCyclone);

// Get cyclone by ID
router.get("/:id", getCycloneById);

// Create new cyclone from latest prediction
router.post("/create-from-prediction", createCycloneFromPrediction);

// Delete cyclone by ID
router.delete("/:id", deleteCyclone);

// Delete all cyclones (use with caution!)
router.delete("/", deleteAllCyclones);

// Debug route: get raw prediction data
router.get('/debug/predicted', async (req, res) => {
  try {
    const { getLatestMergedPrediction } = require('../services/predictionMergeService');
    const merged = await getLatestMergedPrediction();
    
    if (!merged) {
      return res.status(404).json({
        status: 'error',
        message: 'No prediction data available'
      });
    }
    
    res.json({ 
      status: 'success', 
      data: merged 
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;