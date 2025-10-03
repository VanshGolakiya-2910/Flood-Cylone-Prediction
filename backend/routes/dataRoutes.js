const express = require('express');
// const countriesData = require('../data/countries');

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

module.exports = router;
