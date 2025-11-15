// backend/services/predictionMergeService.js
const PredictedTrack = require('../models/PredictedTrack');
const Prediction = require('../models/Prediction');
const Cyclone = require('../models/Cyclone');
const { getStateFromCoordinates } = require('../utils/geocoding');

/**
 * Return the latest merged prediction:
 * {
 *   cyclone_run,
 *   trajectory: [{lat,lng,time,state}, ...],
 *   firstPoint: {lat,lng,time},
 *   firstState: 'State name' || 'Unknown',
 *   probability: 0.52
 * }
 */
async function getLatestMergedPrediction({ persistStates = true } = {}) {
  // 1. Get latest predicted track
  const predicted = await PredictedTrack.findOne().sort({ createdAt: -1 });
  if (!predicted) return null;

  // 2. Get latest prediction
  const predRecord = await Prediction.findOne().sort({ created_at_utc: -1, _id: -1 });

  // clone trajectory so we can modify
  const trajectory = (predicted.trajectory || []).map(p => ({
    lat: p.lat,
    lng: p.lng,
    time: p.time ? new Date(p.time) : null,
    state: p.state || null
  }));

  let updated = false;
  // 3. Fill states where missing using geocoding with rate limiting
  for (let i = 0; i < trajectory.length; i++) {
    const pt = trajectory[i];
    if ((pt.lat !== undefined && pt.lng !== undefined) && !pt.state) {
      try {
        const state = await getStateFromCoordinates(pt.lat, pt.lng);
        pt.state = state || 'Unknown';
        // update underlying predicted doc only if persistStates true
        if (persistStates && !predicted.trajectory[i].state) {
          predicted.trajectory[i].state = pt.state;
          updated = true;
        }
        // Add delay to respect Nominatim rate limits (1 req/sec)
        if (i < trajectory.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1100));
        }
      } catch (err) {
        console.error(`Error geocoding point ${i}:`, err.message);
        pt.state = 'Unknown';
      }
    }
  }

  // If we added states to predicted doc and user requested persistence, save it
  if (persistStates && updated) {
    try {
      await predicted.save();
    } catch (err) {
      console.error('Failed to persist predicted track states:', err.message);
    }
  }

  const firstPoint = trajectory.length > 0 ? trajectory[0] : null;
  const firstState = firstPoint ? (firstPoint.state || 'Unknown') : null;

  const merged = {
    cyclone_run: predicted.cyclone_run || null,
    trajectory,
    firstPoint,
    firstState,
    probability: predRecord ? predRecord.probability : null,
    predictionRecord: predRecord ? {
      window_index: predRecord.window_index,
      seq_start: predRecord.seq_start,
      seq_end: predRecord.seq_end
    } : undefined
  };

  return merged;
}

/**
 * Helper to normalize state strings
 * Trims, removes empty, excludes 'Unknown' (case-insensitive).
 */
function normalizeState(s) {
  if (!s && s !== 0) return null;
  const t = String(s).trim();
  if (!t) return null;
  if (t.toLowerCase() === 'unknown') return null;
  return t;
}

/**
 * Calculate distance between two coordinates in kilometers using Haversine formula
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Save merged prediction to Cyclone collection
 * Only includes states within a certain radius of the first point
 */
async function saveMergedPredictionToCyclone(maxDistanceKm = 500) {
  try {
    // Get the latest merged prediction
    const merged = await getLatestMergedPrediction({ persistStates: true });
    
    if (!merged) {
      console.log('No prediction data available to save');
      return null;
    }

    if (!merged.firstPoint) {
      console.log('No first point available in prediction');
      return null;
    }

    // Extract affected states from trajectory that are near the first point
    const statesSet = new Set();
    const firstLat = merged.firstPoint.lat;
    const firstLng = merged.firstPoint.lng;
    
    if (merged.trajectory && merged.trajectory.length > 0) {
      for (const point of merged.trajectory) {
        if (point.lat !== undefined && point.lng !== undefined) {
          // Calculate distance from first point
          const distance = calculateDistance(firstLat, firstLng, point.lat, point.lng);
          
          // Only include states within the specified radius
          if (distance <= maxDistanceKm) {
            const ns = normalizeState(point.state);
            if (ns) {
              statesSet.add(ns);
              console.log(`Including state: ${ns} (distance: ${distance.toFixed(2)} km from first point)`);
            }
          }
        }
      }
    }

    // Build cyclone document
    const cycloneData = {
      probability: merged.probability,
      firstPoint: {
        lat: merged.firstPoint.lat,
        lng: merged.firstPoint.lng,
        time: merged.firstPoint.time
      },
      affectedStates: Array.from(statesSet).sort((a, b) => a.localeCompare(b)),
      trajectory: merged.trajectory
    };

    // Create new cyclone (we can add logic to check for duplicates based on firstPoint coordinates if needed)
    const cyclone = new Cyclone(cycloneData);
    console.log('Saving new cyclone to database...', cycloneData);
    await cyclone.save();
    console.log(`Created new cyclone with probability: ${merged.probability}`);
    console.log(`Affected states within ${maxDistanceKm}km:`, cycloneData.affectedStates);
    return cyclone;
  } catch (error) {
    console.error('Error saving merged prediction to Cyclone:', error.message);
    throw error;
  }
}

module.exports = { 
  getLatestMergedPrediction,
  saveMergedPredictionToCyclone 
};