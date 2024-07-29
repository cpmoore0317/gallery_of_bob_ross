const express = require('express');
const router = express.Router();

const pool = require('./dbConfig');

// Route to fetch colors used and return only painting titles
router.get('/colors_used', async (req, res, next) => {
	const { color } = req.query; // Use req.query for GET request parameters
  
	try {
	  if (!color) {
		return res.status(400).json({ error: 'Color query parameter is required' });
	  }
  
	  // Parameterized query to prevent SQL injection
	  const result = await pool.query(
		'SELECT painting_title FROM colors_used WHERE colors ILIKE $1',
		[`%${color}%`]
	  );
  
	  // Extract painting titles from the result
	  const paintingTitles = result.rows.map(row => row.painting_title);
	  res.json(paintingTitles);
	} catch (err) {
	  console.error('Error fetching colors_used:', err);
	  next(err);
	}
  });
  
// Route to fetch episode dates
router.get('/episode_dates/:month', async (req, res, next) => {
	try {
	  const year = req.params.year;
	  const month = req.params.month;
	  const result = await pool.query(`
		SELECT * FROM episode_dates
		WHERE air_date LIKE '%${month}%'`);

	console.log(typeof result);
	//   results = JSON.stringify(result);
  
	const titles = [];
	  const filteredEpisodeDates = result.rows.filter(episode => {
		titles.push( episode.title);
	  });
  
	  res.json(titles);
	} catch (err) {
	  console.error('Error fetching episode_dates:', err);
	  next(err);
	}
  });

// Route to fetch subject matter
router.get('/subject_matter', async (req, res, next) => {
	try {
	  const { filter } = req.query; // Get the filter parameter from the request query
	  
	  const result = await pool.query('SELECT * FROM subject_matter');
	  const subjectMatter = result.rows;
	  
	  // Filter the results based on the subject matter
	  const filteredSubjectMatter = subjectMatter.filter((item) => {
		return item.subject_matter === filter;
	  });
  
	  // Remove keys with false values
	  const cleanedSubjectMatter = filteredSubjectMatter.map((item) => {
		const cleanedItem = {};
		for (const key in item) {
		  if (item[key] !== false) {
			cleanedItem[key] = item[key];
		  }
		}
		return cleanedItem;
	  });
	  
	  res.json(cleanedSubjectMatter);
	} catch (err) {
	  console.error('Error fetching subject_matter:', err);
	  next(err);
	}
  });

module.exports = router;
