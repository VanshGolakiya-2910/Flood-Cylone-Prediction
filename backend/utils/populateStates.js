// Utility function to populate states for existing data
const Cyclone = require('../models/Cyclone');
const Flood = require('../models/Flood');
const { getStateFromCoordinates } = require('./geocoding');

// Populate states for all existing cyclones
const populateCycloneStates = async () => {
  try {
    const cyclones = await Cyclone.find();
    console.log(`Found ${cyclones.length} cyclones to process`);

    for (const cyclone of cyclones) {
      let updated = false;

      // Populate states for trajectory
      if (cyclone.trajectory && cyclone.trajectory.length > 0) {
        for (const point of cyclone.trajectory) {
          if (point.lat && point.lng && !point.state) {
            try {
              point.state = await getStateFromCoordinates(point.lat, point.lng);
              updated = true;
              console.log(`Cyclone [${cyclone.name}] - Populated state for trajectory (${point.lat}, ${point.lng}): ${point.state}`);
            } catch (err) {
              console.error(`Error populating state for trajectory (${point.lat}, ${point.lng}):`, err.message);
              point.state = 'Unknown';
              updated = true;
            }
          }
        }
      }

      // Populate state for landfall coordinates
      if (cyclone.landfallCoordinates && 
          cyclone.landfallCoordinates.lat && 
          cyclone.landfallCoordinates.lng && 
          !cyclone.landfallCoordinates.state) {
        try {
          cyclone.landfallCoordinates.state = await getStateFromCoordinates(
            cyclone.landfallCoordinates.lat,
            cyclone.landfallCoordinates.lng
          );
          updated = true;
          console.log(`Cyclone [${cyclone.name}] - Populated state for landfall: ${cyclone.landfallCoordinates.state}`);
        } catch (err) {
          console.error(`Error populating state for landfall:`, err.message);
          cyclone.landfallCoordinates.state = 'Unknown';
          updated = true;
        }
      }

      if (updated) {
        await cyclone.save();
        console.log(`Updated cyclone: ${cyclone.name}`);
      }
    }

    console.log('Finished populating cyclone states');
  } catch (error) {
    console.error('Error populating cyclone states:', error);
  }
};

// Populate states for all existing floods
const populateFloodStates = async () => {
  try {
    const floods = await Flood.find();
    console.log(`Found ${floods.length} floods to process`);

    for (const flood of floods) {
      let updated = false;

      if (flood.landCoordinates && flood.landCoordinates.length > 0) {
        for (const coord of flood.landCoordinates) {
          if (coord.lat && coord.lng && !coord.state) {
            try {
              coord.state = await getStateFromCoordinates(coord.lat, coord.lng);
              updated = true;
              console.log(`Flood [${flood.region}] - Populated state for coordinate (${coord.lat}, ${coord.lng}): ${coord.state}`);
            } catch (err) {
              console.error(`Error populating state for coordinate (${coord.lat}, ${coord.lng}):`, err.message);
              coord.state = 'Unknown';
              updated = true;
            }
          }
        }
      }

      if (updated) {
        await flood.save();
        console.log(`Updated flood: ${flood.region}`);
      }
    }

    console.log('Finished populating flood states');
  } catch (error) {
    console.error('Error populating flood states:', error);
  }
};

// Populate states for all existing data
const populateAllStates = async () => {
  console.log('Starting to populate states for all existing data...');
  await populateCycloneStates();
  await populateFloodStates();
  console.log('Finished populating all states');
};

module.exports = {
  populateCycloneStates,
  populateFloodStates,
  populateAllStates
};

