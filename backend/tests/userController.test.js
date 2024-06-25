// backend/tests/userController.test.js

const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../config/database');
const User = require('../models/User');

beforeAll(async () => {
  console.log('Syncing the database schema...');
  try {
    await sequelize.sync({ force: true });
    console.log('Database schema synced.');
  } catch (error) {
    console.error('Error syncing database schema:', error);
  }
});

afterAll(async () => {
  console.log('Closing the database connection...');
  try {
    await sequelize.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
});

describe('User CRUD Operations', () => {
  let userId;

  it('should create a new user', async () => {
    console.log('Creating a new user...');
    const response = await request(app)
      .post('/users')
      .send({ name: 'John Doe', email: 'john@example.com', password: 'password123' });
    console.log('Response:', response.body);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name', 'John Doe');
    expect(response.body).toHaveProperty('email', 'john@example.com');
    userId = response.body.id;
    console.log('New user created with ID:', userId);
  });

  it('should get a user by ID', async () => {
    console.log('Getting user by ID:', userId);
    const response = await request(app)
      .get(`/users/${userId}`);
    console.log('Response:', response.body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', userId);
    expect(response.body).toHaveProperty('email', 'john@example.com');
  });

  it('should get all users', async () => {
    console.log('Getting all users...');
    const response = await request(app)
      .get('/users');
    console.log('Response:', response.body);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should update a user by ID', async () => {
    console.log('Updating user by ID:', userId);
    const response = await request(app)
      .put(`/users/${userId}`)
      .send({ name: 'John Updated' });
    console.log('Response:', response.body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('name', 'John Updated');
  });

  it('should delete a user by ID', async () => {
    console.log('Deleting user by ID:', userId);
    const response = await request(app)
      .delete(`/users/${userId}`);
    console.log('Response:', response.body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'User deleted');
  });

  it('should return 404 for non-existing user', async () => {
    const nonExistingId = 'non-existing-id';
    console.log('Trying to get a non-existing user by ID:', nonExistingId);
    const response = await request(app)
      .get(`/users/${nonExistingId}`);
    console.log('Response:', response.body);
    expect(response.statusCode).toBe(404);
  });
});
