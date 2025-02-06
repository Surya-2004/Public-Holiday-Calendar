require('dotenv').config();
const express = require('express');
const cors = require('cors');
const countriesRouter = require('./routes/countriesRoute');
const holidaysRouter = require('./routes/holidaysRoute');
const sequelize = require('./config/db');  

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Sync the models
async function syncModels() {
  try {
    await sequelize.sync({ alter: true });  
    console.log('All models are synced with the database.');
  } catch (error) {
    console.error('Error syncing models:', error);
  }
}


syncModels();

// Routes
app.use('/api/countries', countriesRouter);
app.use('/api/holidays', holidaysRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, (req, res)=>{
  console.log(`Server running in port ${PORT}`);
})
