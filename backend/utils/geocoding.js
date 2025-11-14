const axios = require('axios');

// Get state from coordinates using reverse geocoding
const getStateFromCoordinates = async (lat, lng) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat: lat,
        lon: lng,
        format: 'json',
        addressdetails: 1
      },
      headers: {
        'User-Agent': 'Flood-Cyclone-Prediction-App'
      },
      timeout: 8000
    });

    // Check if response and data exist
    if (!response || !response.data) {
      console.error(`Invalid response for coordinates (${lat}, ${lng})`);
      return 'Unknown';
    }

    const address = response.data.address;
    
    // Check if address exists
    if (!address) {
      console.error(`No address found for coordinates (${lat}, ${lng})`);
      return 'Unknown';
    }
    
    // Try to get state from different possible fields
    const state = address.state || 
                  address.region || 
                  address.province || 
                  address.state_district ||
                  address.county ||
                  address.state_code ||
                  'Unknown';

    return state;
  } catch (error) {
    console.error(`Error getting state for coordinates (${lat}, ${lng}):`, error.message);
    return 'Unknown';
  }
};

module.exports = { getStateFromCoordinates };

