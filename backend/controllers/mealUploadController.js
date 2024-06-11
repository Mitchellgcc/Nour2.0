const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const { connectToMongoDB } = require('../utils/dbUtils');
const { isValidAnalysisResult, parseAndConvertAnalysisResult } = require('../utils/validationUtils');

// Improved error handling function
function handleError(res, error, message = 'An error occurred') {
  console.error(message, error);
  res.status(500).json({ error: message, details: error.message });
}

// Image upload directory setup
const uploadPath = path.join(__dirname, '..', 'uploads', 'finishedMeal');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, uploadPath); },
  filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage: storage }).single('mealImage');

// Function to encode image to base64
function encodeImageToBase64(imagePath) {
  return fs.readFileSync(imagePath, { encoding: 'base64' });
}

// Function to analyze meal image using OpenAI Vision API
async function analyzeMealImage(imagePath) {
  try {
    const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4-turbo",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze the meal in the image and output the analysis in a structured JSON format. The JSON should include an array named 'items', each item being an object with 'name', 'quantity', 'totalCalories', 'macronutrients', and 'micronutrients' as keys. Each macronutrient (proteins, carbohydrates, fats) should be expressed in grams. The micronutrients should also be detailed, including but not limited to vitamins (e.g., Vitamin A, Vitamin C, Vitamin D, Vitamin E, and B vitamins), minerals (e.g., Calcium, Iron, Magnesium, Zinc, Selenium), and other nutritional elements such as fiber and sugar. Additionally, include metrics for Glycemic Index, Glycemic Load, Sodium, Cholesterol, Water Content, Omega-3 and Omega-6 fatty acids, Polyphenols, Antioxidants, and a detailed breakdown of soluble and insoluble fiber. Provide quantities in either grams or milligrams as appropriate. Additionally, include a summary object that covers the total caloric intake of the meal and aggregated amounts of both macronutrients and key micronutrients. The summary should include fields for total calories, and totals for proteins, carbohydrates, fats, vitamins, minerals, and other key metrics in appropriate units. Ensure that the micronutrient summary aggregates the quantities of each vitamin and mineral from all items in the meal. Example format: \n\n` +
                JSON.stringify({
                  items: [
                    {
                      "name": "food_item_name",
                      "quantity": "amount_in_grams",
                      "totalCalories": "total_caloric_amount",
                      "macronutrients": {
                        "proteins": "amount_in_grams",
                        "carbohydrates": "amount_in_grams",
                        "fats": "amount_in_grams",
                        "sodium": "amount_in_milligrams",
                        "cholesterol": "amount_in_milligrams",
                        "waterContent": "amount_in_grams",
                        "omega3": "amount_in_grams",
                        "omega6": "amount_in_grams",
                        "solubleFiber": "amount_in_grams",
                        "insolubleFiber": "amount_in_grams"
                      },
                      "micronutrients": {
                        "Vitamin A": "amount_in_micrograms",
                        "Vitamin C": "amount_in_milligrams",
                        "Vitamin D": "amount_in_IU",
                        "Vitamin E": "amount_in_milligrams",
                        "Vitamin K": "amount_in_micrograms",
                        "Vitamin B12": "amount_in_micrograms",
                        "Vitamin B6": "amount_in_milligrams",
                        "Folate": "amount_in_micrograms",
                        "Calcium": "amount_in_milligrams",
                        "Iron": "amount_in_milligrams",
                        "Magnesium": "amount_in_milligrams",
                        "Zinc": "amount_in_milligrams",
                        "Selenium": "amount_in_micrograms",
                        "Polyphenols": "amount_in_milligrams",
                        "Antioxidants": "amount_in_milligrams",
                        "Fiber": "amount_in_grams",
                        "Sugar": "amount_in_grams"
                      },
                      "glycemicIndex": "estimated_GI_value",
                      "glycemicLoad": "estimated_GL_value"
                    }
                    // ... additional food items
                  ],
                  summary: {
                    "totalCalories": "sum_of_total_caloric_amounts",
                    "macronutrients": {
                      "proteins": "summed_amount_in_grams",
                      "carbohydrates": "summed_amount_in_grams",
                      "fats": "summed_amount_in_grams",
                      "sodium": "summed_amount_in_milligrams",
                      "cholesterol": "summed_amount_in_milligrams",
                      "waterContent": "summed_amount_in_grams",
                      "omega3": "summed_amount_in_grams",
                      "omega6": "summed_amount_in_grams",
                      "solubleFiber": "summed_amount_in_grams",
                      "insolubleFiber": "summed_amount_in_grams"
                    },
                    "micronutrients": {
                      "Vitamin A": "summed_amount_in_micrograms",
                      "Vitamin C": "summed_amount_in_milligrams",
                      "Vitamin D": "summed_amount_in_IU",
                      "Vitamin E": "summed_amount_in_milligrams",
                      "Vitamin K": "summed_amount_in_micrograms",
                      "Vitamin B12": "summed_amount_in_micrograms",
                      "Vitamin B6": "summed_amount_in_milligrams",
                      "Folate": "summed_amount_in_micrograms",
                      "Calcium": "summed_amount_in_milligrams",
                      "Iron": "summed_amount_in_milligrams",
                      "Magnesium": "summed_amount_in_milligrams",
                      "Zinc": "summed_amount_in_milligrams",
                      "Selenium": "summed_amount_in_micrograms",
                      "Polyphenols": "summed_amount_in_milligrams",
                      "Antioxidants": "summed_amount_in_milligrams",
                      "Fiber": "summed_amount_in_grams",
                      "Sugar": "summed_amount_in_grams"
                    },
                    "glycemicIndex": "average_GI_value",
                    "glycemicLoad": "total_GL_value"
                  }
                }, null, 2) + "\n\nReturn the structured JSON response for the meal in the image, including the aggregated macronutrient and micronutrient totals in the summary section."
            },
            { 
              type: "image_url", 
              image_url: { url: `data:image/jpeg;base64,${imageBase64}` } 
            }
          ]
        }
      ],
      max_tokens: 2000
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });

    console.log("API response:", JSON.stringify(response.data, null, 2));

    if (response.data && response.data.choices && response.data.choices[0]) {
      return response.data.choices[0].message.content;
    } else {
      throw new Error('Invalid or empty response from GPT-4 Vision API');
    }
  } catch (error) {
    console.error('Error in analyzing meal image:', error);
    throw error;
  }
}

// Function to parse JSON from the structured analysis result
function parseJSONFromResponse(responseText) {
  const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[1]);
  }
  throw new Error('JSON not found in the response text');
}

// Function to handle meal upload
async function handleMealUpload(req, res, next) {
  upload(req, res, async (err) => {
    if (err) {
      return handleError(res, err, 'Error uploading file');
    }

    const mealImageFile = req.file;
    const userId = req.user ? req.user.id : null;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: User ID is missing.' });
    }

    try {
      console.log("Analyzing meal image at path:", mealImageFile.path);
      const structuredAnalysisResultText = await analyzeMealImage(mealImageFile.path);

      console.log("Structured Analysis Result Text:", structuredAnalysisResultText);

      let structuredAnalysisResult;
      try {
        structuredAnalysisResult = parseJSONFromResponse(structuredAnalysisResultText);
        console.log("Before conversion:", JSON.stringify(structuredAnalysisResult, null, 2));
        structuredAnalysisResult = parseAndConvertAnalysisResult(structuredAnalysisResult);
        console.log("After conversion:", JSON.stringify(structuredAnalysisResult, null, 2));
      } catch (jsonError) {
        return handleError(res, jsonError, 'Error parsing JSON from response');
      }

      console.log("Structured Analysis Result:", JSON.stringify(structuredAnalysisResult, null, 2));

      if (!isValidAnalysisResult(structuredAnalysisResult)) {
        return handleError(res, new Error('Invalid structured analysis result'), 'Invalid structured analysis result');
      }

      const db = await connectToMongoDB();
      const dailyLogsCollection = db.collection('dailynutritionallogs');
      const currentDate = new Date().toISOString().split('T')[0];

      let dailyLog = await dailyLogsCollection.findOne({ userId: userId, date: currentDate });

      if (!dailyLog) {
        dailyLog = { userId: userId, date: currentDate, meals: [] };
        await dailyLogsCollection.insertOne(dailyLog);
      }

      await dailyLogsCollection.updateOne(
        { userId: userId, date: currentDate },
        { $push: { meals: structuredAnalysisResult } }
      );

      res.json({ message: 'Meal image uploaded and analyzed successfully', analysis: structuredAnalysisResult });
    } catch (error) {
      return handleError(res, error, 'Error processing meal image');
    } finally {
      if (mealImageFile && mealImageFile.path) {
        fs.unlink(mealImageFile.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      }
    }
  });
}

module.exports = { handleMealUpload };
