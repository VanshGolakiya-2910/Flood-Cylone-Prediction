const express = require('express');
const countriesData = require('../data/countries');
const dashboardData = require('../data/dashboard');
const alertsData = require('../data/alerts');

const router = express.Router();

// Get all countries
router.get('/countries', (req, res) => {
  try {
    const countries = Object.keys(countriesData);
    res.status(200).json({
      status: 'success',
      data: { countries }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch countries'
    });
  }
});

// Get states by country
router.get('/states/:country', (req, res) => {
  try {
    const { country } = req.params;
    const states = countriesData[country];
    
    if (!states) {
      return res.status(404).json({
        status: 'error',
        message: 'Country not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { states }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch states'
    });
  }
});

// Get all countries with their states
router.get('/countries-states', (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      data: { countriesData }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch countries and states'
    });
  }
});

// Dashboard static data
router.get('/dashboard', (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      data: dashboardData
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch dashboard data'
    });
  }
});

// Alerts static data
router.get('/alerts', (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      data: alertsData
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch alerts data'
    });
  }
});

module.exports = router;
