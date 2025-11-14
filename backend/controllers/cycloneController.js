// backend/controllers/cycloneController.js
const Cyclone = require("../models/Cyclone");
const { getStateFromCoordinates } = require("../utils/geocoding");

// Get latest cyclone with states from stored data, auto-populate if missing
const getCyclone = async (req, res) => {
  try {
    const cyclone = await Cyclone.findOne().sort({ updatedAt: -1 });
    if (!cyclone) {
      return res.status(200).json({ status: "success", data: null, states: [] });
    }
    
    let needsUpdate = false;

    // Check and populate states for trajectory if missing
    if (cyclone.trajectory && cyclone.trajectory.length > 0) {
      for (const point of cyclone.trajectory) {
        if (point.lat && point.lng && (!point.state || point.state === 'Unknown')) {
          try {
            const state = await getStateFromCoordinates(point.lat, point.lng);
            point.state = state || 'Unknown';
            needsUpdate = true;
            if (state && state !== 'Unknown') {
              console.log(`Cyclone [${cyclone.name || 'Unknown'}] - Auto-populated state for trajectory (${point.lat}, ${point.lng}): ${point.state}`);
            }
          } catch (err) {
            console.error(`Error getting state for trajectory (${point.lat}, ${point.lng}):`, err.message);
            point.state = 'Unknown';
            needsUpdate = true;
          }
        }
      }
    }

    // Check and populate state for landfall coordinates if missing
    if (cyclone.landfallCoordinates && 
        cyclone.landfallCoordinates.lat && 
        cyclone.landfallCoordinates.lng && 
        (!cyclone.landfallCoordinates.state || cyclone.landfallCoordinates.state === 'Unknown')) {
      try {
        const state = await getStateFromCoordinates(
          cyclone.landfallCoordinates.lat,
          cyclone.landfallCoordinates.lng
        );
        cyclone.landfallCoordinates.state = state || 'Unknown';
        needsUpdate = true;
        if (state && state !== 'Unknown') {
          console.log(`Cyclone [${cyclone.name || 'Unknown'}] - Auto-populated state for landfall (${cyclone.landfallCoordinates.lat}, ${cyclone.landfallCoordinates.lng}): ${cyclone.landfallCoordinates.state}`);
        }
      } catch (err) {
        console.error(`Error getting state for landfall coordinates:`, err.message);
        cyclone.landfallCoordinates.state = 'Unknown';
        needsUpdate = true;
      }
    }

    // Save if states were populated (wrap in try-catch to prevent 500 errors)
    if (needsUpdate) {
      try {
        await cyclone.save();
        console.log(`Cyclone [${cyclone.name || 'Unknown'}] - Updated with states`);
      } catch (saveErr) {
        console.error(`Error saving cyclone:`, saveErr.message);
        // Continue even if save fails
      }
    }

    // Collect all states
    const states = new Set();

    // Get states from stored trajectory data
    if (cyclone.trajectory && cyclone.trajectory.length > 0) {
      cyclone.trajectory.forEach(point => {
        if (point.state && point.state !== 'Unknown') {
          states.add(point.state);
        }
      });
    }

    // Get state from stored landfall coordinates
    if (cyclone.landfallCoordinates && 
        cyclone.landfallCoordinates.state && 
        cyclone.landfallCoordinates.state !== 'Unknown') {
      states.add(cyclone.landfallCoordinates.state);
    }

    const cycloneObj = cyclone.toObject();
    cycloneObj.states = Array.from(states);

    console.log(`Cyclone [${cyclone.name || 'Unknown'}] - All States:`, Array.from(states));

    // Always return 200 status
    res.status(200).json({ 
      status: "success", 
      data: cycloneObj,
      states: Array.from(states)
    });
  } catch (err) {
    console.error('Error in getCyclone:', err.message);
    // Always return 200 status even on error, with empty data
    res.status(200).json({ 
      status: "success", 
      data: null, 
      states: [],
      message: "Data temporarily unavailable"
    });
  }
};

module.exports = { getCyclone };
