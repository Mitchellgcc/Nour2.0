// backend/utils/dbUtils.js
const mongoose = require('mongoose');
require('dotenv').config();

let mongoClient;

const connect = async (uri) => {
  if (uri) {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } else {
    if (!mongoClient) {
      mongoClient = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB');
    }
  }
};

const clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  mongoClient = null;
  console.log('MongoDB connection closed');
};

module.exports = {
  connect,
  clearDatabase,
  closeDatabase,
};
