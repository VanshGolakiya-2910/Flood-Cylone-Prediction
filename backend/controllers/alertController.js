// controllers/alertController.js
const AlertService = require('../services/alertService');

const getAllAlerts = async (req, res) => {
  try {
    const alerts = await AlertService.getAllAlerts(); // service handles DB
    res.status(200).json({ status: 'success', data: alerts });
  } catch (err) {
    console.error('Error fetching alerts:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

module.exports = {
  getAllAlerts
};