const express = require('express');
const router = express.Router();
const logger = require('../logger'); // Adjust path as necessary
const mongoose = require('mongoose');
const Episode = require('../src/models/episodes');
const { getFilteredEpisodes } = require('../controllers/episodeController');

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
    const episodes = await Episode.find({}, 'Season episode youtube_src Episode_title id')
      .sort({ Season: 1, id: 1 }); // Sort by Season in ascending order

    logger.info('Fetched episodes sorted by season in ascending order', { count: episodes.length });
    res.json({ episodes });
  } catch (error) {
    logger.error('Error fetching episodes sorted by season', { message: error.message });
    res.status(500).json({ message: error.message });
  }
});

// Route to fetch episode by season and episode
// curl -X GET http://localhost:4000/episodes/1/1
router.get('/:season/:episode', async (req, res) => {
  try {
    const { season, episode } = req.params;

    // Log the request details
    logger.info('Fetching episode data', { season, episode });

    // Query the Episode collection
    const episodeData = await Episode.findOne(
      { Season: season, episode: episode },
      { Episode_title: 1, youtube_src: 1, img_src: 1 }
    );

    if (!episodeData) {
      logger.warn('Episode not found', { season, episode });
      return res.status(404).json({ error: 'Episode not found' });
    }

    // Log successful fetch
    logger.info('Episode data fetched successfully', { season, episode, episodeData });

    res.json(episodeData);
  } catch (error) {
    // Log the error with additional context
    logger.error('Error fetching episode data', { message: error.message, stack: error.stack });

    res.status(500).json({ error: 'An error occurred while fetching the episode data' });
  }
});


// Fetch episodes for multiple seasons (e.g., 1 through 5)
// curl -X GET "http://localhost:4000/episodes/season/1-5"

router.get('/season/:startSeason-:endSeason', async (req, res) => {
  try {
    const { startSeason, endSeason } = req.params;

    // Convert season parameters to integers
    const start = parseInt(startSeason, 10);
    const end = parseInt(endSeason, 10);

    if (isNaN(start) || isNaN(end) || start > end) {
      return res.status(400).json({ message: 'Invalid season range' });
    }

    // Log the parameters and query being executed
    logger.info('Querying episodes for season range', { startSeason, endSeason });

    // Fetch episodes where the season is within the specified range
    const episodes = await Episode.find({
      Season: { $gte: start, $lte: end }
    }).sort({ Season: 1 });

    logger.info('Query result', { count: episodes.length, episodes });

    if (episodes.length === 0) {
      return res.status(404).json({ message: 'No episodes found for this season range' });
    }

    // Format and return the results
    const result = episodes.map(ep => ({
      id: ep.id,
      Episode_title: ep.Episode_title,
      Season: ep.Season,
      episode: ep.episode,
      youtube_src: ep.youtube_src
    }));

    logger.info('Fetched episodes for season range', { startSeason, endSeason, count: result.length });
    res.json(result);
  } catch (error) {
    logger.error('Error fetching episodes for season range', { message: error.message });
    res.status(500).json({ message: error.message });
  }
});

router.get('/test-route/:param', (req, res) => {
  console.log(req.params);
  res.send('Route is working!');
});

// trying to fetch seasons 6-10


// Search by Episode_title and return Season, episode, and youtube_src
// curl -X GET "http://localhost:4000/episodes/search-by-title?title=BALMY%20BEACH"

router.get('/search-by-title', async (req, res) => {
  console.log('Received search request for title:', req.query.title);
  try {
    const { title, page = 1, limit = 12 } = req.query;
    if (!title) {
      return res.status(400).json({ message: 'Title query parameter is required' });
    }

    // Calculate the number of documents to skip based on the current page and limit
    const skip = (page - 1) * limit;

    // Search for the episode by title
    const episode = await Episode.find({ Episode_title: { $regex: title, $options: 'i' } }) // Case-insensitive search
      .skip(skip)
      .limit(parseInt(limit));

    if (episode.length === 0) {
      return res.status(404).json({ message: 'Episode not found' });
    }

    // Count the total number of matching episodes for pagination
    const totalEpisodes = await Episode.countDocuments({ Episode_title: { $regex: title, $options: 'i' } });
    const totalPages = Math.ceil(totalEpisodes / limit);

    // Return the desired fields
    const result = episode.map(episode => ({

      // id: ep.id,
      Episode_title: episode.Episode_title,
      Season: episode.Season,
      episode: episode.episode,
      youtube_src: episode.youtube_src
    }));

    logger.info('Fetched episode by title', { title, result });
    res.json({
      episode: result,
      currentPage: parseInt(page),
      totalPages: totalPages,
    });
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
    const { page = 1, limit = 12 } = req.query;
    
    // Ensure page and limit are integers
    const pageNumber = parseInt(page, 12);
    const limitNumber = parseInt(limit, 12);

    if (pageNumber < 1 || limitNumber < 1) {
      return res.status(400).json({ message: 'Page and limit must be positive integers' });
    }

    // Calculate the number of documents to skip based on the current page and limit
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch the episodes with pagination
    const episodes = await Episode.find({}, 'Season episode youtube_src Episode_title')
      .skip(skip)
      .limit(limitNumber);

    // Count the total number of matching episodes for pagination
    const totalEpisodes = await Episode.countDocuments({});
    const totalPages = Math.ceil(totalEpisodes / limitNumber);

    // Return the paginated result
    res.json({
      episodes,
      currentPage: pageNumber,
      totalPages: totalPages,
    });
  } catch (error) {
    logger.error('Error fetching episodes with specific fields', { message: error.message });
    res.status(500).json({ message: error.message });
  }
});

// season range 1-5
router.get('/episodes/fields', async (req, res) => {
  const { seasonStart, seasonEnd, page = 1, limit = 10 } = req.query;

  // Construct the base query
  let query = 'SELECT * FROM episodes';
  let queryParams = [];
  
  // Add conditions if season filtering is specified
  if (seasonStart && seasonEnd) {
      queryParams.push(seasonStart, seasonEnd);
      query += ' WHERE season BETWEEN $1 AND $2';
  }

  // Pagination logic
  const offset = (page - 1) * limit;
  query += ` ORDER BY season ASC, episode ASC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
  queryParams.push(limit, offset);

  try {
      const result = await db.query(query, queryParams);
      const episodes = result.rows;

      // Get the total count for pagination
      const countResult = await db.query('SELECT COUNT(*) FROM episodes WHERE season BETWEEN $1 AND $2', [seasonStart, seasonEnd]);
      const totalEpisodes = parseInt(countResult.rows[0].count, 10);
      const totalPages = Math.ceil(totalEpisodes / limit);

      res.json({
          episodes,
          totalPages,
          currentPage: parseInt(page, 10),
      });
  } catch (error) {
      console.error('Error fetching episodes:', error);
      res.status(500).json({ error: 'Error fetching episodes' });
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

router.get('/episodes/ids/:range', async (req, res) => {
  const { range } = req.params;
  const [start, end] = range.split('-').map(Number);

  if (!start || !end || isNaN(start) || isNaN(end)) {
      return res.status(400).json({ error: 'Invalid range format' });
  }

  try {
      const episodes = await Episode.find({
          id: { $gte: start, $lte: end }
      });

      if (episodes.length === 0) {
          return res.status(404).json({ error: 'Episode not found' });
      }

      res.json({ episodes });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
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
