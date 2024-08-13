const express = require('express');
const router = express.Router();
const logger = require('../logger');
const Episode = require('../src/models/episodes');
const Dates = require('../src/models/dates');
const Colors = require('../src/models/colors');
const db = require('../src/db'); // Make sure to import your db connection

// Get all episodes
router.get('/', async (req, res) => {
  try {
    const episodes = await Episode.find();
    const colors = await Colors.find();
    const dates = await Dates.find();

    const results = {
      // episodes,
      colors,
      // dates
    };

    logger.info('Fetched episodes, colors, and dates:', { results });
    res.json(results);
  } catch (error) {
    logger.error('Error fetching all data', { message: error.message });
    res.status(500).json({ message: error.message });
  }
});

// Get all episodes sorted by season
router.get('/sort-by-season', async (req, res) => {
  try {
    const { season } = req.query;
    let query = {};
    if (season) {
      query.Season = season;
    }
    const episodes = await Episode.find(query, 'Season youtube_src').sort({ Season: 1 }); // Ensure 'Season' field matches the schema
    logger.info('Fetched episodes sorted by season', { season, count: episodes.length });
    res.json(episodes);
  } catch (error) {
    logger.error('Error fetching episodes by season', { message: error.message });
    res.status(500).json({ message: error.message });
  }
});

// Get paintings by seasons
router.get('/api/paintings', async (req, res) => {
  try {
    const { seasons } = req.query;
    const seasonsArray = seasons ? seasons.split(',').map(Number) : [];
  
    logger.info(`Fetching paintings for seasons: ${seasonsArray.join(', ')}`);
  
    const paintingsQuery = seasonsArray.length > 0 
      ? { Season: { $in: seasonsArray } } 
      : {};
  
    const paintings = await db.collection('colors_used_data').find(paintingsQuery).toArray();
  
    logger.info(`Found ${paintings.length} paintings`);
  
    // Format the paintings data
    const formattedPaintings = paintings.map(painting => ({
      _id: painting._id,
      Season: painting.Season,
      Episode: painting.episode,
      Title: painting.Episode_title,
      Colors: painting.colors.trim().split(/\s*'\s*/).filter(Boolean),
      // Include any other fields you want to return
      ...painting
    }));
  
    res.json(formattedPaintings);
  } catch (error) {
    logger.error('Error fetching paintings', { error: error.message });
    res.status(500).send('Error fetching data');
  }
});

// Add other routes (e.g., GET by ID, POST, PUT, DELETE) as needed

module.exports = router;
