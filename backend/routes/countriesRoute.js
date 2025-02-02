const express = require('express');
const router = express.Router();
const { fetchCountries } = require('../controllers/countriesController');

// Fetch all countries
router.get('/', fetchCountries);

module.exports = router;
