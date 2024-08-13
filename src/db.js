// db.js
const { MongoClient } = require('mongodb');
const logger = require('../logger'); // Import the logger


const uri = 'mongodb://localhost:27017'; // MongoDB URI
const client = new MongoClient(uri);

let db;

async function connectToDb() {
  try {
    await client.connect();
    db = client.db('the_joy_of_painting'); // Database name
    logger.info('Connected to database');
  } catch (err) {
    logger.error('Failed to connect to database', err);
    process.exit(1); // Exit process with failure code
  }
}

function getDb() {
  return db;
}

module.exports = { connectToDb, getDb };
