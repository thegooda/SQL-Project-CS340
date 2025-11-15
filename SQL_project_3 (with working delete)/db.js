const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'classmysql.engr.oregonstate.edu',
  user: 'cs340_nguyphi4',
  password: '5211', // replace with your password
  database: 'cs340_nguyphi4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool; // no .promise() here