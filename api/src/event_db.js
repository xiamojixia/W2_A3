const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host:'localhost',
  user: 'root',
  password: '123456',
  database: 'charityevents_db',
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool;