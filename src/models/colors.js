const { ObjectId } = require('bson');
const mongoose = require('mongoose');

// Define schema matching your data structure
const episodeSchema = new mongoose.Schema({
    _id: ObjectId,
    Alizarin_Crimson: Number,
    Black_Gesso: Number,
    Bright_Red: Number,
    Burnt_Umber: Number,
    Cadmium_Yellow: Number,
    color_hex: String,
    colors: String,
    Dark_Sienna: Number,
    episode: Number,
    id: Number,
    img_src: String,
    Indian_Red: Number,
    Indian_Yellow: Number,
    Liquid_Black: Number,
    Liquid_Clear: Number,
    Midnight_Black: Number,
    num_colors: Number,
    painting_index: Number,
    Episode_title: String,
    Phthalo_Blue: Number,
    Phthalo_Green: Number,
    Prussian_Blue: Number,
    Sap_Green: Number,
    Season: Number,
    Titanium_White: Number,
    Van_Dyke_Brown: Number,
    Yellow_Ochre: Number,
    youtube_src: String,
});

// Create a model based on the schema
const Colors = mongoose.model('Colors', episodeSchema, 'colors_used_data');

module.exports = Colors;
