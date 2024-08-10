const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 4000;

app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/the_joy_of_painting', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define routes
app.get('/episodes', (req, res) => {
  // Logic to fetch data from MongoDB
  res.send('Episodes endpoint');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
