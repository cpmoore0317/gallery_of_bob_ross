const { MongoClient } = require('mongodb');

async function fetchData() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('the_joy_of_painting');
    // fetfch data from episodes_datacollection
    const episodesCollection = db.collection('episodes_data');
    const episodes = await episodesCollection.find({}).toArray();

    // fetchdata from colors_used collection
    const colorsCollection = db.collection('colors_used_data');
    const colors = await colorsCollection.find({}).toArray();

    // fetch data from dates collection
    const datesCollection = db.collection('episode_dates_data');
    const dates = await datesCollection.find({}).toArray();

    if (episodes.length === 0 && colors.length === 0 && dates.length ===0) {
      console.log('No documents found.');
    } else {
      console.log('episodes:', episodes);
      console.log('episodes:', colors);
      console.log('episodes:', dates);
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

fetchData();
