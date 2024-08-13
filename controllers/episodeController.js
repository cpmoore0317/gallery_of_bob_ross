// controllers/episodeController.js
const Episode = require('../src/models/episodes'); // Adjust the path as necessary

exports.getFilteredEpisodes = async (req, res) => {
  const { startSeason, endSeason, startEpisode, endEpisode } = req.params;

  try {
    // Convert parameters to integers
    const startSeasonInt = parseInt(startSeason, 10);
    const endSeasonInt = parseInt(endSeason, 10);
    const startEpisodeInt = parseInt(startEpisode, 10);
    const endEpisodeInt = parseInt(endEpisode, 10);

    // Query to filter episodes
    const episodes = await Episode.find({
      season: { $gte: startSeasonInt, $lte: endSeasonInt },
      episode: { $gte: startEpisodeInt, $lte: endEpisodeInt }
    });

    // Respond with the results
    res.json({ count: episodes.length, episodes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
