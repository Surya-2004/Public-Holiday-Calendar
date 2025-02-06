const express = require('express');
const router = express.Router();
const { fetchHolidays } = require('../controllers/holidaysController');

// Route for fetching holidays
router.get('/:country/:year?', fetchHolidays);


module.exports = router;
