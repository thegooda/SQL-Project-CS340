const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'classmysql.engr.oregonstate.edu',
  user: 'cs340_haneyth',
  password: '4344', // replace with your password
  database: 'cs340_haneyth',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool; // no .promise() here