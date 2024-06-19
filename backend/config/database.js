// Updated database.js

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

const connectMongoDB = async () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(process.env.MONGODB_URI);

        mongoose.connection.once('open', () => {
            console.log('MongoDB connected');
            resolve();
        });

        mongoose.connection.on('error', err => {
            console.error('MongoDB connection error:', err);
            reject(err);
        });
    });
};

const disconnectMongoDB = async () => {
    return mongoose.disconnect();
};

module.exports = { sequelize, connectMongoDB, disconnectMongoDB };
