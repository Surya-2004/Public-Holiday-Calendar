const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Connected to Neon PostgreSQL!");
  } catch (error) {
    console.error("Connection failed:", error);
  }
}

testConnection();

module.exports = sequelize;
