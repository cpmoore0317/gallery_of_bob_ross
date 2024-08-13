const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 4000;
const episodeRouter = require('../src/routes'); // Ensure this path is correct

app.use(express.json());
app.use('/episodes', episodeRouter);
app.use('/api', episodeRouter); // Use the routes

// tests route
app.use((req, res, next) => {
  res.status(404).send('Sorry, can\'t find that route!');
});


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/the_joy_of_painting')
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB:', error));

// Define routes
app.get('/episodes', (req, res) => {
  res.send('Episodes endpoint');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
