const express = require('express');
const router = express.Router();
const logger = require('../logger');
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

// Get all episodes sorted by season
router.get('/sort-by-season', async (req, res) => {
	try {
		const episodes = await Episode.find().sort({ season: 1 }); // 1 for ascending order, -1 for descending
		res.json(episodes);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.get('/api/paintings', async (req, res) => {
	try {
	  const { seasons } = req.query;
	  const seasonsArray = seasons.split(',').map(Number);
	  
	  logger.info(`Fetching paintings for seasons: ${seasonsArray.join(', ')}`);
  
	  const paintings = await db.collection('colors_used_data').find({ Season: { $in: seasonsArray } }).toArray();
	  
	  logger.info(`Found ${paintings.length} paintings`);
  
	  res.json(paintings);
	} catch (error) {
	  logger.error('Error fetching data', { error: error.message });
	  res.status(500).send('Error fetching data');
	}
  });
// Add other routes (e.g., GET by ID, POST, PUT, DELETE) as needed

module.exports = router;
