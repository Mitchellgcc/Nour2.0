// add_missing_data.js
require('dotenv').config();
const mongoose = require('mongoose');
const Meal = require('./models/Meal');

// Connect to MongoDB using the connection string from the environment variables
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

async function addMissingData() {
  try {
    const userId = "abc42412-0b4c-4e8c-ba7a-3d41c4a96ad1";
    const currentDate = new Date('2024-07-12');

    // Create one meal log for testing
    const mealData = {
      name: "Test Meal",
      description: "Sample meal for testing",
      calories: 400,
      protein: 20,
      carbs: 50,
      fat: 15,
      micronutrients: { A: 200, C: 15 },
      vitamins: { A: 200, C: 15 },
      minerals: { calcium: 100, iron: 8 },
      glycemicIndex: 45,
      glycemicLoad: 10,
      waterContent: 200,
      omega3: 1.5,
      omega6: 2.0,
      polyphenols: 10,
      antioxidants: 50,
      solubleFiber: 5,
      insolubleFiber: 3,
      sodium: 300,
      cholesterol: 150,
      fiber: 8,
      sugar: 20,
      aminoAcids: { leucine: 2.5, lysine: 1.8 },
      fattyAcids: { saturated: 5, unsaturated: 10 },
      nutrientDensityScore: 85,
      healthImpactScore: 90,
      inflammationScore: 10,
      oxidativeStressScore: 20,
      microbiomeImpactScore: 30,
      allergens: ['eggs', 'gluten'],
      userId: userId,
      createdAt: currentDate,
      updatedAt: currentDate
    };

    const meal = new Meal(mealData);
    await meal.save();

    console.log('Test meal added successfully!');
  } catch (error) {
    console.error('Error adding test meal:', error);
  } finally {
    mongoose.connection.close();
  }
}

addMissingData();
