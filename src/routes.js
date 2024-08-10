const express = require('express');
const router = express.Router();
const Episode = require('../src/models/episodes');

// Get all episodes
router.get('/', async (req, res) => {
	try {
	  const episodes = await Episode.find();
	  console.log('Fetched episodes:', episodes); // Log the fetched data
	  res.json(episodes);
	} catch (error) {
	  res.status(500).json({ message: error.message });
	}
});

// Add other routes (e.g., GET by ID, POST, PUT, DELETE) as needed

module.exports = router;
