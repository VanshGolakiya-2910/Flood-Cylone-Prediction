// utils/geocoding.js - Enhanced version with caching
const axios = require('axios');

// In-memory cache to avoid repeated geocoding calls
const stateCache = new Map();

// Last request timestamp for rate limiting
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1100; // 1.1 seconds to be safe with Nominatim

/**
 * Generate cache key from coordinates (rounded to 2 decimal places)
 * This helps cache nearby points as the same location
 */
function getCacheKey(lat, lng) {
  return `${lat.toFixed(2)},${lng.toFixed(2)}`;
}

/**
 * Wait to respect rate limits
 */
async function respectRateLimit() {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastRequestTime = Date.now();
}

/**
 * Get state from coordinates using reverse geocoding
 * Includes caching and rate limiting
 */
const getStateFromCoordinates = async (lat, lng) => {
  // Check cache first
  const cacheKey = getCacheKey(lat, lng);
  if (stateCache.has(cacheKey)) {
    console.log(`Cache hit for (${lat}, ${lng})`);
    return stateCache.get(cacheKey);
  }

  // Respect rate limits
  await respectRateLimit();

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
      stateCache.set(cacheKey, 'Unknown');
      return 'Unknown';
    }

    const address = response.data.address;
    
    // Check if address exists
    if (!address) {
      console.error(`No address found for coordinates (${lat}, ${lng})`);
      stateCache.set(cacheKey, 'Unknown');
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

    // Cache the result
    stateCache.set(cacheKey, state);
    console.log(`Geocoded (${lat}, ${lng}) -> ${state}`);
    
    return state;
  } catch (error) {
    console.error(`Error getting state for coordinates (${lat}, ${lng}):`, error.message);
    stateCache.set(cacheKey, 'Unknown');
    return 'Unknown';
  }
};

/**
 * Clear the cache (useful for testing or memory management)
 */
const clearCache = () => {
  stateCache.clear();
  console.log('Geocoding cache cleared');
};

/**
 * Get cache statistics
 */
const getCacheStats = () => {
  return {
    size: stateCache.size,
    keys: Array.from(stateCache.keys())
  };
};

module.exports = { 
  getStateFromCoordinates,
  clearCache,
  getCacheStats
};