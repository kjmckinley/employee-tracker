//connect to the database
const mysql = require('mysql2');

// password security
// require('dotenv').config();

// let database = process.env.database;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "Nagasaki!2",
    database: 'employeeTracker_db'
  },
  console.log(`Connected to the database.`)
);

module.exports = db;