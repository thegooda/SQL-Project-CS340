/*
  The following code was almost directly copied from the starter code provided in the exploration for Web Application Technology.
  Link: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-web-application-technology-2?module_item_id=25645131
*/

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'classmysql.engr.oregonstate.edu',
  user: // replace with your login
  password: // replace with your password
  database: 'cs340_haneyth',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;