// backend/config/database.js

const { Sequelize } = require('sequelize');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.POSTGRESQL_URI, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        useUTC: false,
        timezone: 'Etc/GMT+0',
    },
    timezone: 'Etc/GMT+0',
});

let isMongoConnected = false;

const connectMongoDB = async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        isMongoConnected = true;
        console.log('MongoDB connected');
    }
};

const disconnectMongoDB = async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
        isMongoConnected = false;
        console.log('MongoDB disconnected');
    }
};

module.exports = { sequelize, connectMongoDB, disconnectMongoDB };
