const express = require('express');
const router = express.Router();
const Episode = require('../src/models/episodes');
const Dates = require('../src/models/dates');
const Colors = require('../src/models/colors');

// Get all episodes
router.get('/', async (req, res) => {
	try {
	  const episodes = await Episode.find();
	  const colors = await Colors.find();
	  const dates = await Dates.find();

	  const results = {
		episodes,
		colors,
		dates
	  };

	  console.log('Fetched episodes, colors, and dates:', results); // Log the fetched data
	  res.json(results);
	} catch (error) {
	  res.status(500).json({ message: error.message });
	}
});

// Add other routes (e.g., GET by ID, POST, PUT, DELETE) as needed

module.exports = router;
