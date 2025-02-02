const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Country = sequelize.define('Country', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  code: {
    type: DataTypes.STRING(2),
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  flag_url: {
    type: DataTypes.STRING(2048),
    allowNull: false,
    validate: {
      isUrl: true, 
      isHttps(value) {
        if (!value.startsWith('https://')) {
          throw new Error('flag_url must start with https://');
        }
      },
    },
  },
}, {
  tableName: 'countries',
  timestamps: false,
});

module.exports = Country;
