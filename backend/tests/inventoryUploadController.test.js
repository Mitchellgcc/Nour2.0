// backend/tests/inventoryUploadController.test.js

const mockAnalysisResponse = require('./__mocks__/mockAnalysisResponse');
const request = require('supertest');
const app = require('../app');
const { connectToMongoDB, closeConnection } = require('../utils/dbUtils');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { sequelize } = require('../config/database');
const User = require('../models/User');
const { logAction } = require('../utils/helpers');

// Mocking axios to simulate external API calls
jest.mock('axios', () => ({
    post: jest.fn().mockResolvedValue({
        data: { choices: [{ message: { content: JSON.stringify(mockAnalysisResponse) } }] }
    }),
    get: jest.fn().mockResolvedValue({ data: {} })
}));

const testUserId = '4ec37ce5-84b9-4989-a60f-ae901eb27eff'; // Use the correct user ID
const validToken = jwt.sign({ id: testUserId }, process.env.JWT_SECRET, { expiresIn: '1h' });
const invalidToken = 'invalidToken';

// Ensure test setup is properly initialized
beforeAll(async () => {
    jest.setTimeout(120000); // Increase the timeout for all tests
    await sequelize.sync(); // Ensure PostgreSQL is ready
    await connectToMongoDB();
    await ensureTestUserExists(testUserId); // Ensure test user exists
    console.log('Test setup completed.');
});

// Ensure test teardown is properly handled
afterAll(async () => {
    await closeConnection();
    await sequelize.close();
    jest.restoreAllMocks();
    console.log('Test teardown completed.');
});

// Test suite for inventory upload controller
describe('Inventory Upload Controller', () => {
    it('should upload and analyze the inventory image successfully', async () => {
        console.log('Testing successful inventory image upload.');
        const filePath = path.resolve(__dirname, './__mocks__/full-fridge-3302264.jpg');
        const response = await request(app)
            .post('/api/inventory/upload')
            .set('Authorization', `Bearer ${validToken}`)
            .attach('inventoryImage', filePath);

        // Debugging logs to identify the issue
        console.log('Response status:', response.status);
        console.log('Response body:', response.body);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Inventory image uploaded and analyzed successfully');
        expect(response.body).toHaveProperty('analysis', mockAnalysisResponse);
        console.log('Test for successful inventory image upload passed.');
    });

    it('should return 401 for missing authorization header', async () => {
        console.log('Testing missing authorization header.');
        const filePath = path.resolve(__dirname, './__mocks__/full-fridge-3302264.jpg');
        const response = await request(app)
            .post('/api/inventory/upload')
            .attach('inventoryImage', filePath);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Authorization header missing');
        console.log('Test for missing authorization header passed.');
    });

    it('should return 401 for invalid token', async () => {
        console.log('Testing invalid token.');
        const filePath = path.resolve(__dirname, './__mocks__/full-fridge-3302264.jpg');
        const response = await request(app)
            .post('/api/inventory/upload')
            .set('Authorization', `Bearer ${invalidToken}`)
            .attach('inventoryImage', filePath);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid token');
        console.log('Test for invalid token passed.');
    });

    it('should handle error during image analysis', async () => {
        console.log('Testing error handling during image analysis.');
        const filePath = path.resolve(__dirname, './__mocks__/full-fridge-3302264.jpg');
        axios.post.mockImplementationOnce(() => Promise.reject(new Error('Error analyzing image')));

        const response = await request(app)
            .post('/api/inventory/upload')
            .set('Authorization', `Bearer ${validToken}`)
            .attach('inventoryImage', filePath);

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('message', 'Error processing inventory image');
        console.log('Test for error handling during image analysis passed.');
    });

    it('should validate analysis data and return error for invalid data', async () => {
        console.log('Testing validation of analysis data.');
        const filePath = path.resolve(__dirname, './__mocks__/full-fridge-3302264.jpg');
        jest.spyOn(require('../utils/helpers'), 'validateData').mockReturnValueOnce(false); // Mock to return false for invalid data

        const response = await request(app)
            .post('/api/inventory/upload')
            .set('Authorization', `Bearer ${validToken}`)
            .attach('inventoryImage', filePath);

        expect(response.status).toBe(400); // Expecting 400 for invalid data
        expect(response.body).toHaveProperty('message', 'Invalid structured analysis result');
        console.log('Test for validation of analysis data passed.');
    });
});

// Helper function to ensure a test user exists
async function ensureTestUserExists(userId) {
    const existingUser = await User.findOne({ where: { id: userId } });
    if (!existingUser) {
        console.log('Creating test user.');
        await User.create({
            id: userId,
            name: 'Test User',
            email: 'mitchellgcc@gmail.com',
            password: 'hashed_password' // Ensure it's hashed if applicable
        });
    }
}
