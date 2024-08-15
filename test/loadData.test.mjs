import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { PassThrough } from 'stream';
import fs from 'fs';
import path from 'path';
import run from '../src/loadData.js'; // Import the run function

// Mock the logger
const loggerStub = {
  info: sinon.stub(),
  error: sinon.stub(),
};

// Mock the MongoDB client
const mongoClientStub = {
  connect: sinon.stub(),
  db: sinon.stub(),
  close: sinon.stub(),
};

// Mock the MongoDB collection
const collectionStub = {
  updateOne: sinon.stub(),
};

// Create a function to simulate CSV parsing
const createCsvStream = (dataRows) => {
  const csvStream = new PassThrough();
  dataRows.forEach((row) => csvStream.write(row));
  csvStream.end();
  return csvStream;
};

// Replace the dependencies with our stubs
const loadData = proxyquire('../src/loadData.js', {
  'mongodb': { MongoClient: sinon.stub().returns(mongoClientStub) },
  'fs': {
    createReadStream: sinon.stub(),
  },
  'csv-parser': sinon.stub().callsFake(() => {
    return createCsvStream([{ id: '1', field1: 'value1', field2: 'value2' }]); // Simulate a CSV stream
  }),
  '../logger': loggerStub,
}).default;

describe('loadData.js', () => {
  beforeEach(() => {
    // Reset the stubs before each test
    mongoClientStub.connect.reset();
    mongoClientStub.db.reset();
    mongoClientStub.close.reset();
    collectionStub.updateOne.reset();
    loggerStub.info.reset();
    loggerStub.error.reset();
  });

  it('should connect to MongoDB and process files correctly', async () => {
    // Set up stubs
    mongoClientStub.connect.resolves();
    mongoClientStub.db.returns({ collection: sinon.stub().returns(collectionStub) });
    mongoClientStub.close.resolves();

    // Call the function
    await run();

    // Assertions
    expect(mongoClientStub.connect.calledOnce).to.be.true;
    expect(mongoClientStub.close.calledOnce).to.be.true;
    expect(loggerStub.info.calledWith('Connected to MongoDB')).to.be.true;
    expect(loggerStub.info.calledWithMatch(/successfully processed/)).to.be.true;
    expect(collectionStub.updateOne.calledOnce).to.be.true;
  });

  it('should handle errors in processing files', async () => {
    // Simulate a connection error
    mongoClientStub.connect.rejects(new Error('Connection failed'));

    // Call the function
    await run();

    // Assertions
    expect(loggerStub.error.calledWith('Error connecting to MongoDB: Connection failed')).to.be.true;
    expect(mongoClientStub.close.calledOnce).to.be.true;
  });

  it('should handle CSV processing errors', async () => {
    // Set up stubs
    mongoClientStub.connect.resolves();
    mongoClientStub.db.returns({ collection: sinon.stub().returns(collectionStub) });
    mongoClientStub.close.resolves();

    const csvStream = createCsvStream([]); // Simulate an empty CSV stream

    // Simulate reading and processing the CSV file
    fs.createReadStream = sinon.stub().returns(csvStream);

    // Call the function
    await run();

    // Assertions
    expect(loggerStub.error.calledWithMatch(/Error processing/)).to.be.true;
    expect(mongoClientStub.close.calledOnce).to.be.true;
  });
});
