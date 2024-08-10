const { MongoClient } = require('mongodb');

async function fetchData() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('the_joy_of_painting');
    const collection = db.collection('episodes_data');

    const documents = await collection.find({}).toArray();
    console.log('Documents:', documents);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

fetchData();
