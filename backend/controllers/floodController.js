// backend/controllers/floodController.js
const Flood = require("../models/Flood");
const { getStateFromCoordinates } = require("../utils/geocoding");

// Get all floods with states from stored data, auto-populate if missing
const getFloods = async (req, res) => {
  try {
    const floods = await Flood.find().sort({ risk: -1 });
    
    // Process each flood to check and populate missing states
    const floodsWithStates = await Promise.all(
      floods.map(async (flood) => {
        let needsUpdate = false;

        // Check and populate states for landCoordinates if missing
        if (flood.landCoordinates && flood.landCoordinates.length > 0) {
          for (const coord of flood.landCoordinates) {
            if (coord.lat && coord.lng && (!coord.state || coord.state === 'Unknown')) {
              try {
                const state = await getStateFromCoordinates(coord.lat, coord.lng);
                coord.state = state || 'Unknown';
                needsUpdate = true;
                if (state && state !== 'Unknown') {
                  console.log(`Flood [${flood.region}] - Auto-populated state for coordinate (${coord.lat}, ${coord.lng}): ${coord.state}`);
                }
              } catch (err) {
                console.error(`Error getting state for coordinate (${coord.lat}, ${coord.lng}):`, err.message);
                coord.state = 'Unknown';
                needsUpdate = true;
              }
            }
          }
        }

        // Save if states were populated (wrap in try-catch to prevent 500 errors)
        if (needsUpdate) {
          try {
            await flood.save();
            console.log(`Flood [${flood.region}] - Updated with states`);
          } catch (saveErr) {
            console.error(`Error saving flood:`, saveErr.message);
            // Continue even if save fails
          }
        }

        // Collect all states
        const states = new Set();
        if (flood.landCoordinates && flood.landCoordinates.length > 0) {
          flood.landCoordinates.forEach(coord => {
            if (coord.state && coord.state !== 'Unknown') {
              states.add(coord.state);
            }
          });
        }

        const floodObj = flood.toObject();
        floodObj.states = Array.from(states);
        
        return floodObj;
      })
    );

    // Log all unique states
    const allStates = new Set();
    floodsWithStates.forEach(flood => {
      flood.states.forEach(state => allStates.add(state));
    });
    console.log('All Flood States:', Array.from(allStates));

    // Always return 200 status
    res.status(200).json({ 
      status: "success", 
      data: floodsWithStates,
      states: Array.from(allStates)
    });
  } catch (err) {
    console.error('Error in getFloods:', err.message);
    // Always return 200 status even on error, with empty data
    res.status(200).json({ 
      status: "success", 
      data: [],
      states: [],
      message: "Data temporarily unavailable"
    });
  }
};

module.exports = { getFloods };
