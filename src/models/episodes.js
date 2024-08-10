const mongoose = require('mongoose');

const episodeSchema = new mongoose.Schema({
  name: String,
  show: String,
  episode: Number,
});

const Episode = mongoose.model('EPISODE', episodeSchema);

module.exports = Episode;
