const Country = require('../models/Country');

const fetchCountries = async (req, res) => {
  try {
    const countries = await Country.findAll(); 
    res.json(countries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

module.exports = { fetchCountries };
