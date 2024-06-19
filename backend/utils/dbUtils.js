// backend/utils/dbUtils.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

const mongoClient = new MongoClient(process.env.MONGODB_URI, { 
  serverSelectionTimeoutMS: 30000 
});
let dbClient;

async function connectToMongoDB() {
  if (!dbClient) {
    dbClient = await mongoClient.connect();
    console.log('Connected to MongoDB');
  }
  return dbClient.db('Nour2');
}

async function closeConnection() {
  if (dbClient) {
    await dbClient.close();
    dbClient = null;
    console.log('MongoDB connection closed');
  }
}

module.exports = { connectToMongoDB, closeConnection };
