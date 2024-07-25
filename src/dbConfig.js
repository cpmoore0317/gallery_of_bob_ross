const { Pool } = require('pg');
const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'mydatabase',
	password: 'mypassword',
	port: 5432,
  });
  
  module.exports = pool;