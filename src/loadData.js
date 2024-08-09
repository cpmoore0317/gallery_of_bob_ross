const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const pool = require('./dbConfig');

// Utility function to read and parse CSV files
const loadCSVData = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
};

// Insert data into the colors_used table
const loadColorsUsedData = async () => {
  const filePath = path.join(__dirname, '../data/colors_used.txt');
  const data = await loadCSVData(filePath);

  for (const row of data) {
    const query = `
      INSERT INTO colors_used (
        id, painting_index, img_src, painting_title, season, episode, num_colors, youtube_src,
        colors, color_hex, black_gesso, bright_red, burnt_umber, cadmium_yellow, dark_sienna,
        indian_red, indian_yellow, liquid_black, liquid_clear, midnight_black, phthalo_blue,
        phthalo_green, prussian_blue, sap_green, titanium_white, van_dyke_brown, yellow_ochre, alizarin_crimson
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21,
        $22, $23, $24, $25, $26, $27, $28
      )
    `;
    const values = [
      row.id, row.painting_index, row.img_src, row.painting_title, row.season, row.episode, row.num_colors, row.youtube_src,
      row.colors, row.color_hex, row.black_gesso === '1', row.bright_red === '1', row.burnt_umber === '1', row.cadmium_yellow === '1',
      row.dark_sienna === '1', row.indian_red === '1', row.indian_yellow === '1', row.liquid_black === '1', row.liquid_clear === '1',
      row.midnight_black === '1', row.phthalo_blue === '1', row.phthalo_green === '1', row.prussian_blue === '1', row.sap_green === '1',
      row.titanium_white === '1', row.van_dyke_brown === '1', row.yellow_ochre === '1', row.alizarin_crimson === '1'
    ];
    await pool.query(query, values);
  }
};

// Insert data into the episode_dates table
const loadEpisodeDatesData = async () => {
  const filePath = path.join(__dirname, '../data/episode_dates.txt');
  const data = await loadCSVData(filePath);

  for (const row of data) {
    const query = 'INSERT INTO episode_dates (title, air_date, air_year) VALUES ($1, $2, $3)';
    const airDateParts = row.air_date.split(' ');
    const airYear = parseInt(airDateParts[2], 10);
    const values = [row.title, row.air_date, airYear];
    await pool.query(query, values);
  }
};

// Insert data into the subject_matter table
const loadSubjectMatterData = async () => {
  const filePath = path.join(__dirname, '../data/subject_matter.txt');
  const data = await loadCSVData(filePath);

  for (const row of data) {
    const query = `
      INSERT INTO subject_matter (
        episode, title, apple_frame, aurora_borealis, barn, beach, boat, bridge, building, bushes, cabin, cactus,
        circle_frame, cirrus, cliff, clouds, conifer, cumulus, deciduous, diane_andre, dock, double_oval_frame, farm,
        fence, fire, florida_frame, flowers, fog, framed, grass, guest, half_circle_frame, half_oval_frame, hills,
        lake, lakes, lighthouse, mill, moon, mountain, mountains, night, ocean, oval_frame, palm_trees, path, person,
        portrait, rectangle_3d_frame, rectangular_frame, river, rocks, seashell_frame, snow, snowy_mountain, split_frame,
        steve_ross, structure, sun, tomb_frame, tree, trees, triple_frame, waterfall, waves, windmill, window_frame, winter,
        wood_framed
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24,
        $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47,
        $48, $49, $50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, $62, $63, $64, $65, $66, $67, $68, $69, $70,
        $71
      )
    `;
    const values = [
      row.episode, row.title, row.apple_frame === '1', row.aurora_borealis === '1', row.barn === '1', row.beach === '1',
      row.boat === '1', row.bridge === '1', row.building === '1', row.bushes === '1', row.cabin === '1', row.cactus === '1',
      row.circle_frame === '1', row.cirrus === '1', row.cliff === '1', row.clouds === '1', row.conifer === '1', row.cumulus === '1',
      row.deciduous === '1', row.diane_andre === '1', row.dock === '1', row.double_oval_frame === '1', row.farm === '1', row.fence === '1',
      row.fire === '1', row.florida_frame === '1', row.flowers === '1', row.fog === '1', row.framed === '1', row.grass === '1', row.guest === '1',
      row.half_circle_frame === '1', row.half_oval_frame === '1', row.hills === '1', row.lake === '1', row.lakes === '1', row.lighthouse === '1',
      row.mill === '1', row.moon === '1', row.mountain === '1', row.mountains === '1', row.night === '1', row.ocean === '1', row.oval_frame === '1',
      row.palm_trees === '1', row.path === '1', row.person === '1', row.portrait === '1', row.rectangle_3d_frame === '1', row.rectangular_frame === '1',
      row.river === '1', row.rocks === '1', row.seashell_frame === '1', row.snow === '1', row.snowy_mountain === '1', row.split_frame === '1',
      row.steve_ross === '1', row.structure === '1', row.sun === '1', row.tomb_frame === '1', row.tree === '1', row.trees === '1', row.triple_frame === '1',
      row.waterfall === '1', row.waves === '1', row.windmill === '1', row.window_frame === '1', row.winter === '1', row.wood_framed === '1'
    ];
    await pool.query(query, values);
  }
};

// Main function to load all data
const loadData = async () => {
  try {
    await loadColorsUsedData();
    console.log('Colors used data loaded successfully');
    await loadEpisodeDatesData();
    console.log('Episode dates data loaded successfully');
    await loadSubjectMatterData();
    console.log('Subject matter data loaded successfully');
  } catch (err) {
    console.error('Error loading data:', err);
  } finally {
    pool.end();
  }
};

// Run the load data function
loadData();
