const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

// Define schema matching your data structure
const episodeSchema = new mongoose.Schema({
  _id: ObjectId,
  Alizarin_Crimson: { type: String, required: true },
  Black_Gesso: { type: String, required: true },
  Bright_Red: { type: String, required: true },
  Burnt_Umber: { type: String, required: true },
  Cadmium_Yellow: { type: String, required: true },
  color_hex: { type: String, required: true },
  colors: { type: String, required: true },
  Dark_Sienna: { type: String, required: true },
  episode: { type: String, required: true },
  id: { type: String, required: true },
  img_src: { type: String, required: true },
  Indian_Red: { type: String, required: true },
  Indian_Yellow: { type: String, required: true },
  Liquid_Black: { type: String, required: true },
  Liquid_Clear: { type: String, required: true },
  Midnight_Black: { type: String, required: true },
  num_colors: { type: String, required: true },
  painting_index: { type: String, required: true },
  Episode_title: { type: String, required: true },
  Phthalo_Blue: { type: String, required: true },
  Phthalo_Green: { type: String, required: true },
  Prussian_Blue: { type: String, required: true },
  Sap_Green: { type: String, required: true },
  Season: { type: String, required: true },
  Titanium_White: { type: String, required: true },
  Van_Dyke_Brown: { type: String, required: true },
  Yellow_Ochre: { type: String, required: true },
  youtube_src: { type: String, required: true },
});

// Create a model based on the schema
const Episode = mongoose.model('Episode', episodeSchema, 'episodes_data');

module.exports = Episode;
