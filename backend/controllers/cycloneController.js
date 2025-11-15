// controllers/cycloneController.js
const Cyclone = require('../models/Cyclone');
const { saveMergedPredictionToCyclone } = require('../services/predictionMergeService');

/**
 * Get all cyclones or the latest cyclone
 * Query params:
 *  - latest=true : returns only the most recent cyclone
 *  - limit=N : limits the number of results
 */
const getCyclone = async (req, res) => {
  try {
    const { latest, limit } = req.query;

    let query = Cyclone.find();

    // Sort by most recent first
    query = query.sort({ createdAt: -1 });

    // If latest flag is set, return only one
    if (latest === 'true') {
      const cyclone = await query.limit(1);
      
      if (!cyclone || cyclone.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'No cyclone predictions found'
        });
      }

      return res.json({
        status: 'success',
        data: cyclone[0]
      });
    }

    // Apply limit if specified
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        query = query.limit(limitNum);
      }
    }

    const cyclones = await query;

    res.json({
      status: 'success',
      count: cyclones.length,
      data: cyclones
    });

  } catch (error) {
    console.error('Error fetching cyclones:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Create a new cyclone from the latest prediction
 * This merges the prediction data and saves it as a cyclone
 */
const createCycloneFromPrediction = async (req, res) => {
  try {
    const { maxDistance } = req.body; // Optional: custom distance in km
    const distance = maxDistance || 1000; // Default 1000km

    const cyclone = await saveMergedPredictionToCyclone(distance);

    if (!cyclone) {
      return res.status(404).json({
        status: 'error',
        message: 'No prediction data available to create cyclone'
      });
    }

    res.status(201).json({
      status: 'success',
      message: 'Cyclone created from prediction',
      data: cyclone
    });

  } catch (error) {
    console.error('Error creating cyclone from prediction:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get cyclone by ID
 */
const getCycloneById = async (req, res) => {
  try {
    const { id } = req.params;

    const cyclone = await Cyclone.findById(id);

    if (!cyclone) {
      return res.status(404).json({
        status: 'error',
        message: 'Cyclone not found'
      });
    }

    res.json({
      status: 'success',
      data: cyclone
    });

  } catch (error) {
    console.error('Error fetching cyclone by ID:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Delete cyclone by ID
 */
const deleteCyclone = async (req, res) => {
  try {
    const { id } = req.params;

    const cyclone = await Cyclone.findByIdAndDelete(id);

    if (!cyclone) {
      return res.status(404).json({
        status: 'error',
        message: 'Cyclone not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Cyclone deleted successfully',
      data: cyclone
    });

  } catch (error) {
    console.error('Error deleting cyclone:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Delete all cyclones
 */
const deleteAllCyclones = async (req, res) => {
  try {
    const result = await Cyclone.deleteMany({});

    res.json({
      status: 'success',
      message: `Deleted ${result.deletedCount} cyclone(s)`,
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('Error deleting all cyclones:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  getCyclone,
  createCycloneFromPrediction,
  getCycloneById,
  deleteCyclone,
  deleteAllCyclones
};