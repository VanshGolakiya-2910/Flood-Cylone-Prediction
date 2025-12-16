const express = require('express');
const AlertService = require('../services/alertService');
const AlertController = require('../controllers/alertController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const router = express.Router();

// POST /api/alerts/area
// Body: { country: string, state: string, title?: string, message: string, ctaUrl?: string, subject?: string }
// Admin only route
router.post('/area', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { country, state, title, message, ctaUrl, subject } = req.body;
    if (!country || !state || !message) {
      return res.status(400).json({
        status: 'error',
        message: 'country, state and message are required'
      });
    }

    const result = await AlertService.sendAreaAlert({ country, state, title, message, ctaUrl, subject });

    return res.status(200).json({
      status: 'success',
      data: {
        country,
        state,
        ...result
      }
    });
  } catch (error) {
    console.error('Area alert error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to send area alert'
    });
  }
});

router.get('/', AlertController.getAllAlerts);
module.exports = router;


