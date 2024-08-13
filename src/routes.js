const express = require('express');
const router = express.Router();
const CombinedData = require('../src/schema');


// Get all episodes
router.get('/', async (req, res) => {
	try {
	  const data = await CombinedData.find();

	  const results = {data};

	  console.log('Fetched episodes, colors, and dates:', results); // Log the fetched data
	  res.json(results);
	} catch (error) {
	  res.status(500).json({ message: error.message });
	}
});

// Get episodes by season
// curl -X GET http://localhost:4000/episodes/season/1
router.get('/season/:season', async (req, res) => {
	try {
	  const season = parseInt(req.params.season);
	  if (isNaN(season)) {
		return res.status(400).json({ message: 'Invalid season parameter' });
	  }
  
	  const episodes = await CombinedData.find({ season: season });
	  if (episodes.length === 0) {
		return res.status(404).json({ message: 'No episodes found for this season' });
	  }
  
	  res.json(episodes);
	} catch (error) {
	  res.status(500).json({ message: error.message });
	}
});

// Route to fetch episode by season and episode
// curl -X GET http://localhost:4000/episodes/1/1
router.get('/:season/:episode', async (req, res) => {
    try {
        const { season, episode } = req.params;
        const episodeData = await CombinedData.findOne({ season: season, episode: episode }, {
            TITLE: 1,
            season: 1,
            episode: 1,
            air_date: 1,
            youtube_src: 1,
            img_link: 1
        });

        if (!episodeData) {
            return res.status(404).json({ error: 'Episode not found' });
        }

        res.json(episodeData);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the episode data' });
    }
});

// Add other routes (e.g., GET by ID, POST, PUT, DELETE) as needed

module.exports = router;
