const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const port = 4000;
const episodeRouter = require('../src/routes'); // Ensure this path is correct

// Use CORS middleware before defining routes
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Define routes
app.use('/episodes', episodeRouter);

// Tester
app.use((req, res, next) => {
  res.status(404).send('Sorry, can\'t find that!');
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/the_joy_of_painting')
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB:', error));

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
