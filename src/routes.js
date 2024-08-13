const express = require('express');
const router = express.Router();
const logger = require('../logger'); // Adjust path as necessary
const mongoose = require('mongoose');
const Episode = require('../src/models/episodes');

// Define MongoDB collection names
const COLLECTIONS = {
  EPISODES: 'episodes_data',
  COLORS: 'colors_used_data',
  DATES: 'episode_dates_data',
};

// Get all episodes
// curl -X GET "http://localhost:4000/episodes"
router.get('/', async (req, res) => {
  try {
    const db = mongoose.connection.db; // Use the db connection
    const episodes = await db.collection(COLLECTIONS.EPISODES).find().toArray();
    const colors = await db.collection(COLLECTIONS.COLORS).find().toArray();
    const dates = await db.collection(COLLECTIONS.DATES).find().toArray();

    const results = {
      episodes,
      // colors,
      // dates,
    };

    logger.info('Fetched episodes, colors, and dates:', { results });
    res.json(results);
  } catch (error) {
    logger.error('Error fetching all data', { message: error.message });
    res.status(500).json({ message: error.message });
  }
});

// Get all episodes sorted by season in ascending order
// curl -X GET "http://localhost:4000/episodes/sorted-by-season"

router.get('/sorted-by-season', async (req, res) => {
  try {
    const episodes = await Episode.find({}, 'Season episode youtube_src Episode_title')
      .sort({ Season: 1 }); // Sort by Season in ascending order

    logger.info('Fetched episodes sorted by season in ascending order', { count: episodes.length });
    res.json({ episodes });
  } catch (error) {
    logger.error('Error fetching episodes sorted by season', { message: error.message });
    res.status(500).json({ message: error.message });
  }
});


// Fetch episodes for multiple seasons (e.g., 1 through 5)
router.get('/seasons/:startSeason-:endSeason', async (req, res) => {
  try {
    const { startSeason, endSeason } = req.params;
    const start = parseInt(startSeason, 10);
    const end = parseInt(endSeason, 10);

    if (isNaN(start) || isNaN(end) || start > end) {
      return res.status(400).json({ message: 'Invalid season range' });
    }

    // Fetch episodes for the range of seasons and sort by Season and episode
    const episodes = await Episode.find({ Season: { $gte: start, $lte: end } })
      .sort({ Season: 1, episode: 1 });

    if (episodes.length === 0) {
      return res.status(404).json({ message: 'No episodes found for this range of seasons' });
    }

    // Select desired fields and rename _id to id
    const result = episodes.map(ep => ({
      
      id: ep.id,
      Episode_title: ep.Episode_title,
      Season: ep.Season,
      episode: ep.episode,
      youtube_src: ep.youtube_src
    }));

    logger.info('Fetched episodes for seasons', { startSeason, endSeason, count: result.length });
    res.json(result);
  } catch (error) {
    logger.error('Error fetching episodes for seasons', { message: error.message });
    res.status(500).json({ message: error.message });
  }
});

// Search by Episode_title and return Season, episode, and youtube_src
// curl -X GET "http://localhost:4000/episodes/search-by-title?title=BALMY%20BEACH"

router.get('/search-by-title', async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) {
      return res.status(400).json({ message: 'Title query parameter is required' });
    }

    // Search for the episode by title
    const episode = await Episode.findOne({ Episode_title: title });

    if (!episode) {
      return res.status(404).json({ message: 'Episode not found' });
    }

    // Return the desired fields
    const result = {
      
      id: ep.id,
      Episode_title: episode.Episode_title,
      Season: episode.Season,
      episode: episode.episode,
      youtube_src: episode.youtube_src
    };

    logger.info('Fetched episode by title', { title, result });
    res.json(result);
  } catch (error) {
    logger.error('Error searching for episode by title', { message: error.message });
    res.status(500).json({ message: error.message });
  }
});


// Fetch episodes by a specific season
// curl -X GET "http://localhost:4000/episodes/season/5"
router.get('/season/:season', async (req, res) => {
  try {
    const { season } = req.params;
    if (!season) {
      return res.status(400).json({ message: 'Season parameter is required' });
    }

    // Fetch episodes for the given season
    const episodes = await Episode.find({ Season: season });

    if (episodes.length === 0) {
      return res.status(404).json({ message: 'No episodes found for this season' });
    }

    // Select desired fields
    const result = episodes.map(ep => ({
     
      id: ep.id,
      Episode_title: ep.Episode_title,
      Season: ep.Season,
      episode: ep.episode,
      youtube_src: ep.youtube_src
    }));

    logger.info('Fetched episodes for season', { season, count: result.length });
    res.json(result);
  } catch (error) {
    logger.error('Error fetching episodes by season', { message: error.message });
    res.status(500).json({ message: error.message });
  }
});

// Get all episodes with specific fields
// curl -X GET "http://localhost:4000/episodes/fields"
router.get('/fields', async (req, res) => {
  try {
    // Query the collection and select specific fields
    const episodes = await Episode.find({}, 'Season episode youtube_src Episode_title'); // Adjust field names based on your schema

    logger.info('Fetched episodes with specific fields', { count: episodes.length });
    res.json({ episodes });
  } catch (error) {
    logger.error('Error fetching episodes with specific fields', { message: error.message });
    res.status(500).json({ message: error.message });
  }
});

// Fetch episode by ID
// curl -X GET "http://localhost:4000/episodes/id/1"
router.get('/id/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Assuming `id` is stored as a string in your MongoDB collection
    const episode = await Episode.findOne({ id: id });

    if (!episode) {
      return res.status(404).json({ message: 'Episode not found' });
    }

    res.json({
      id: episode.id,
      Episode_title: episode.Episode_title,
      Season: episode.Season,
      episode: episode.episode,
      youtube_src: episode.youtube_src
    });
  } catch (error) {
    logger.error('Error fetching episode by ID', { message: error.message });
    res.status(500).json({ message: error.message });
  }
});

// targets id range 1-65 covers all seasons 1-5
// curl -X GET "http://localhost:4000/episodes/ids/1-65"

router.get('/ids/:startId-:endId', async (req, res) => {
  try {
    const { startId, endId } = req.params;
    const start = parseInt(startId, 10);
    const end = parseInt(endId, 10);

    if (isNaN(start) || isNaN(end) || start > end) {
      return res.status(400).json({ message: 'Invalid ID range' });
    }

    // Fetch episodes where the id is within the specified range
    const episodes = await Episode.find({
      id: { $gte: start, $lte: end }
    }).sort({ id: 1 });

    if (episodes.length === 0) {
      return res.status(404).json({ message: 'No episodes found for this range of IDs' });
    }

    // Format response to include the custom id and formatted _id
    const result = episodes.map(ep => ({
      
      id: ep.id,
      Episode_title: ep.Episode_title,
      Season: ep.Season,
      episode: ep.episode,
      youtube_src: ep.youtube_src
    }));

    logger.info('Fetched episodes for IDs', { startId, endId, count: result.length });
    res.json(result);
  } catch (error) {
    logger.error('Error fetching episodes for IDs', { message: error.message });
    res.status(500).json({ message: error.message });
  }
});

// trying to fetch episodes 66-130 by ids 66-130
// testing with curl -X GET "http://localhost:4000/episodes/66-130/rangetwo" still not working though
router.get('/ids/:startId-:endId/rangetwo', async (req, res) => {
  try {
    const { startId, endId } = req.params;

    // Ensure IDs are valid strings
    if (typeof startId !== 'string' || typeof endId !== 'string') {
      return res.status(400).json({ message: 'Invalid ID range' });
    }

    // Fetch episodes where the id is within the specified range
    const episodes = await Episode.find({
      id: { $gte: startId, $lte: endId }
    }).sort({ id: 1 });

    if (episodes.length === 0) {
      return res.status(404).json({ message: 'No episodes found for this range of IDs' });
    }

    // Format response
    const result = episodes.map(ep => ({
      id: ep.id,
      Episode_title: ep.Episode_title,
      Season: ep.Season,
      episode: ep.episode,
      youtube_src: ep.youtube_src
    }));

    console.log('Fetched episodes for ID range', { startId, endId, count: result.length });
    res.json(result);
  } catch (error) {
    console.error('Error fetching episodes for ID range', { message: error.message });
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
