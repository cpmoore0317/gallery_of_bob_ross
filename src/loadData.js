const { MongoClient } = require('mongodb');
const fs = require('fs');
const csv = require('csv-parser');
const logger = require('../logger'); // Import the logger

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    logger.info('Connected to MongoDB');

    const db = client.db('the_joy_of_painting');
    const collection = db.collection('episodes_data');

    // Read and merge CSV files
    const mergedData = [];

    const processFile = (filePath, mergeFunction) => {
      return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (row) => mergeFunction(row))
          .on('end', () => {
            logger.info(`${filePath} successfully processed`);
            resolve();
          })
          .on('error', (error) => {
            logger.error(`Error processing ${filePath}: ${error.message}`);
            reject(error);
          });
      });
    };

    // Process the first file
    await processFile('/home/moonwalker/Atlas-T4_Projects/PartnerProjects/final_project/gallery_of_bob_ross/data/colorsdatadump.csv', (row) => {
      mergedData.push(row); // Add base data
    });

    // Process the second file and merge data
    await processFile('/home/moonwalker/Atlas-T4_Projects/PartnerProjects/final_project/gallery_of_bob_ross/data/datadump.csv', (row) => {
      const existingRecord = mergedData.find((record) => record.id === row.id);
      if (existingRecord) {
        existingRecord.someField = row.someField; // Add or merge fields
      }
    });

    // Process the third file and merge data
    await processFile('/home/moonwalker/Atlas-T4_Projects/PartnerProjects/final_project/gallery_of_bob_ross/data/datesdatadump.csv', (row) => {
      const existingRecord = mergedData.find((record) => record.id === row.id);
      if (existingRecord) {
        existingRecord.anotherField = row.anotherField;
      }
    });

    // Insert the merged data into MongoDB
    try {
      await collection.insertMany(mergedData);
      logger.info('Data successfully inserted into MongoDB');
    } catch (err) {
      logger.error(`Error inserting data into MongoDB: ${err.message}`);
    }

  } catch (err) {
    logger.error(`Error connecting to MongoDB: ${err.message}`);
  } finally {
    await client.close();
    logger.info('MongoDB connection closed');
  }
}

run().catch(err => logger.error(`Unhandled error: ${err.message}`));
