const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Ensure app.js exports your Express app
const UserPreferences = require('../models/UserPreferences');

describe('User Preferences API', () => {
  let server;
  let testUserId;

  beforeAll(async () => {
    server = app.listen(5002); // Start server on a different port for testing
    console.log('Test server started on port 5002');
    try {
      await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  });

  afterAll(async () => {
    try {
      await mongoose.connection.close();
      console.log('Disconnected from MongoDB');
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
    }
    if (server) {
      server.close(() => {
        console.log('Test server closed');
      });
    }
  });

  beforeEach(async () => {
    testUserId = new mongoose.Types.ObjectId();
    console.log('Generated new test user ID:', testUserId);
    try {
      await UserPreferences.deleteMany(); // Clear the UserPreferences collection before each test
      console.log('Cleared UserPreferences collection');
    } catch (error) {
      console.error('Error clearing UserPreferences collection:', error);
    }
  });

  it('should create new user preferences', async () => {
    const newPreferences = {
      userId: testUserId.toString(),
      preferredCuisines: ['Italian', 'Mexican'],
      healthGoals: 'weight loss',
      dietaryRestrictions: ['gluten-free'],
      allergies: ['peanuts'],
      macroTargets: { proteins: 150, carbohydrates: 200, fats: 50 },
      mealFrequency: 3,
      mealTimes: ['08:00', '12:00', '18:00'],
      hydrationGoals: 2500,
      supplementPreferences: ['vitamin D'],
      preferredMealTypes: ['breakfast', 'dinner'],
      preferredIngredients: ['chicken', 'broccoli'],
      fitnessLevel: 'intermediate'
    };

    console.log('Sending request to create new user preferences:', newPreferences);

    const response = await request(app)
      .post('/user/preferences')
      .send(newPreferences);

    console.log('Response:', response.body);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User preferences saved successfully');
    expect(response.body.data).toMatchObject(newPreferences);
  });

  it('should update existing user preferences', async () => {
    const existingPreferences = new UserPreferences({
      userId: testUserId,
      preferredCuisines: ['Indian'],
      healthGoals: 'maintenance'
    });
    await existingPreferences.save();
    console.log('Saved initial user preferences:', existingPreferences);

    const updatedPreferences = {
      userId: testUserId.toString(),
      preferredCuisines: ['Italian', 'Chinese'],
      healthGoals: 'muscle gain'
    };

    console.log('Sending request to update user preferences:', updatedPreferences);

    const response = await request(app)
      .post('/user/preferences')
      .send(updatedPreferences);

    console.log('Response:', response.body);

    expect(response.status).toBe(200);
    expect(response.body.data.preferredCuisines).toEqual(['Italian', 'Chinese']);
    expect(response.body.data.healthGoals).toBe('muscle gain');
  });

  it('should retrieve user preferences', async () => {
    const existingPreferences = new UserPreferences({
      userId: testUserId,
      preferredCuisines: ['Chinese', 'Mexican'],
      healthGoals: 'general health',
      dietaryRestrictions: ['lactose-free'],
      allergies: ['nuts']
    });
    await existingPreferences.save();
    console.log('Saved user preferences for retrieval test:', existingPreferences);

    console.log('Sending request to retrieve user preferences for user ID:', testUserId);

    const response = await request(app)
      .get(`/user/preferences/${testUserId}`);

    console.log('Response:', response.body);

    expect(response.status).toBe(200);
    expect(response.body.data.preferredCuisines).toEqual(['Chinese', 'Mexican']);
    expect(response.body.data.healthGoals).toBe('general health');
    expect(response.body.data.dietaryRestrictions).toEqual(['lactose-free']);
    expect(response.body.data.allergies).toEqual(['nuts']);
  });

  it('should return 404 for non-existent user preferences', async () => {
    const nonExistentUserId = new mongoose.Types.ObjectId();
    console.log('Sending request to retrieve non-existent user preferences for user ID:', nonExistentUserId);

    const response = await request(app)
      .get(`/user/preferences/${nonExistentUserId}`);

    console.log('Response:', response.body);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User preferences not found');
  });

  it('should return validation error for invalid data', async () => {
    const invalidPreferences = {
      userId: testUserId.toString(),
      preferredCuisines: 'Italian', // Should be an array
      healthGoals: 'weight lifting' // Not a valid enum value
    };

    console.log('Sending request with invalid data:', invalidPreferences);

    const response = await request(app)
      .post('/user/preferences')
      .send(invalidPreferences);

    console.log('Response:', response.body);

    expect(response.status).toBe(400);
    expect(response.body.errors).toHaveLength(2);
    expect(response.body.errors[0].msg).toBe('Invalid value');
  });
});
