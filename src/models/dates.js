const mongoose = require('mongoose');

// Define schema matching your data structure
const episodeSchema = new mongoose.Schema({
  Episode_title: String,
  Air_date: String,
  Year: Number,
});

// Create a model based on the schema
const Dates = mongoose.model('Dates', episodeSchema, 'episode_dates_data');

module.exports = Dates;
