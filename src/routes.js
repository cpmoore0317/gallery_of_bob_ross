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

// Get episodes by season
// Curl example:
// curl -X GET http://localhost:4000/episodes/season/1

router.get('/season/:season', async (req, res) => {
	try {
	  const season = parseInt(req.params.season);
	  if (isNaN(season)) {
		return res.status(400).json({ message: 'Invalid season parameter' });
	  }
  
	  const episodes = await Episode.find({ season: season });
	  if (episodes.length === 0) {
		return res.status(404).json({ message: 'No episodes found for this season' });
	  }
  
	  res.json(episodes);
	} catch (error) {
	  res.status(500).json({ message: error.message });
	}
  });

// Get sorted episodes by season and episode
// curl -X GET "http://localhost:4000/episodes/sorted?sortBy=season&sortOrder=asc"
// curl -X GET "http://localhost:4000/episodes/sorted?sortBy=episode&sortOrder=desc"

router.get('/episodes/sorted', async (req, res) => {
	try {
	  // Retrieve sort order from query parameters
	  const { sortBy = 'season', sortOrder = 'asc' } = req.query;
  
	  // Validate sort parameters
	  const validSortBy = ['season', 'episode'].includes(sortBy);
	  const validSortOrder = ['asc', 'desc'].includes(sortOrder);
  
	  if (!validSortBy || !validSortOrder) {
		return res.status(400).json({ message: 'Invalid sort parameters' });
	  }
  
	  // Set sort direction based on query parameter
	  const sortDirection = sortOrder === 'asc' ? 1 : -1;
  
	  const episodes = await Episode.find().sort({ [sortBy]: sortDirection });
  
	  if (episodes.length === 0) {
		return res.status(404).json({ message: 'No episodes found' });
	  }
  
	  res.json(episodes);
	} catch (error) {
	  res.status(500).json({ message: error.message });
	}
  });

// Add other routes (e.g., GET by ID, POST, PUT, DELETE) as needed

module.exports = router;
