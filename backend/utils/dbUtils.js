const { MongoClient } = require('mongodb');

const mongoClient = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
let dbClient;

async function connectToMongoDB() {
  if (!dbClient) {
    dbClient = await mongoClient.connect();
  }
  return dbClient.db('Nour2'); // Updated database name
}

module.exports = { connectToMongoDB };
