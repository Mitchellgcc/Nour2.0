// backend/jest.setup.js

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { sequelize } = require('../backend/config/database');

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  console.log(`MongoMemoryServer URI: ${uri}`);

  // Connect to MongoDB
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');
  }

  // Sync Sequelize
  console.log('Syncing the database schema...');
  try {
    await sequelize.sync({ force: true });
    console.log('Database schema synced.');
  } catch (error) {
    console.error('Error syncing database schema:', error);
  }
});

afterAll(async () => {
  // Close MongoDB connection
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
  if (mongod) {
    await mongod.stop();
    console.log('MongoMemoryServer stopped');
  }

  // Close Sequelize connection
  console.log('Closing the database connection...');
  try {
    await sequelize.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
});

afterEach(async () => {
  // Clear MongoDB collections
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
    console.log(`Collection ${key} cleared`);
  }
});
