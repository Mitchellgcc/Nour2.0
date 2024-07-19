// backend/controllers/inventoryUploadController.js

const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const { connectToMongoDB } = require('../utils/dbUtils');
const { validateData, categorizeItems, convertUnitsToUK, handleErrors, logAction } = require('../utils/helpers');
const handleAxiosError = require('../utils/handleAxiosError');

const uploadPath = path.join(__dirname, '..', 'uploads', 'inventory');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, uploadPath); },
    filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage: storage }).single('inventoryImage');

function encodeImageToBase64(imagePath) {
    return fs.readFileSync(imagePath, { encoding: 'base64' });
}

async function analyzeImage(imagePath, prompt) {
    try {
        logAction(`Encoding image to base64 from path: ${imagePath}`);
        const imageBase64 = encodeImageToBase64(imagePath);
        logAction(`Sending image to GPT-4 for analysis.`);

        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-4-turbo",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: prompt
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

        if (response.data && response.data.choices && response.data.choices[0]) {
            logAction(`Received response from GPT-4.`);
            return JSON.parse(response.data.choices[0].message.content);
        } else {
            throw new Error('Invalid or empty response from GPT-4 Vision API');
        }
    } catch (error) {
        handleAxiosError(error, null, 'analyzeImage');
        throw error;
    }
}

function getPromptForImageType(imageType) {
    logAction(`Generating prompt for image type: ${imageType}`);
    const fridgePrompt = `Analyze the image and output a structured JSON response with detailed information about each item in the fridge. Include:
    - name
    - quantity with appropriate UK units
    - totalCalories
    - macronutrients (proteins, carbohydrates, fats, sodium, cholesterol, waterContent, omega3, omega6, solubleFiber, insolubleFiber)
    - micronutrients (Vitamin A, Vitamin C, Vitamin D, Vitamin E, Vitamin K, Vitamin B12, Vitamin B6, Folate, Calcium, Iron, Magnesium, Zinc, Selenium, Polyphenols, Antioxidants, Fiber, Sugar)
    - glycemicIndex
    - glycemicLoad
    - actualExpirationDate
    - estimatedExpirationDate if the actual date is not visible
    - unit
    - confidence
    - category

    Flag items with a confidence level below 80% for manual review. Provide a summary of categories at the end and include detailed error messages for any issues encountered, such as low confidence or missing information.`;

    const receiptPrompt = `Analyze the receipt image and output a structured JSON response with detailed information about each item on the receipt. Include:
    - name
    - quantity with appropriate UK units
    - totalCalories
    - macronutrients (proteins, carbohydrates, fats, sodium, cholesterol, waterContent, omega3, omega6, solubleFiber, insolubleFiber)
    - micronutrients (Vitamin A, Vitamin C, Vitamin D, Vitamin E, Vitamin K, Vitamin B12, Vitamin B6, Folate, Calcium, Iron, Magnesium, Zinc, Selenium, Polyphenols, Antioxidants, Fiber, Sugar)
    - glycemicIndex
    - glycemicLoad
    - actualExpirationDate
    - estimatedExpirationDate if the actual date is not visible
    - unit
    - confidence
    - category

    Flag items with a confidence level below 80% for manual review. Provide a summary of categories at the end and include detailed error messages for any issues encountered, such as low confidence or missing information.`;

    if (imageType === 'fridge') {
        return fridgePrompt;
    } else if (imageType === 'receipt') {
        return receiptPrompt;
    } else {
        throw new Error('Unknown image type');
    }
}

function detectImageType(imagePath) {
    logAction(`Detecting image type for path: ${imagePath}`);
    if (imagePath.toLowerCase().includes('fridge')) {
        return 'fridge';
    } else if (imagePath.toLowerCase().includes('receipt')) {
        return 'receipt';
    } else {
        throw new Error('Unable to detect image type');
    }
}

async function handleInventoryUpload(req, res, next) {
    logAction(`Starting inventory upload process.`);
    upload(req, res, async (err) => {
        if (err) {
            return handleErrors(res, err, 'Error uploading file');
        }

        const inventoryImageFile = req.file;
        const userId = req.user ? req.user.id : null;

        if (!userId) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }

        try {
            logAction(`Analyzing inventory image for user ${userId}: ${inventoryImageFile.path}`);
            const imageType = detectImageType(inventoryImageFile.path);
            const prompt = getPromptForImageType(imageType);
            const structuredAnalysisResult = await analyzeImage(inventoryImageFile.path, prompt);

            if (!validateData(structuredAnalysisResult)) {
                return res.status(400).json({ message: 'Invalid structured analysis result' });
            }

            const categorizedItems = categorizeItems(structuredAnalysisResult.items);
            const convertedItems = convertUnitsToUK(categorizedItems);

            const db = await connectToMongoDB();
            const inventoryCollection = db.collection('inventory');
            const currentDate = new Date().toISOString().split('T')[0];

            let userInventory = await inventoryCollection.findOne({ userId: userId, date: currentDate });

            if (!userInventory) {
                userInventory = { userId: userId, date: currentDate, items: [] };
                await inventoryCollection.insertOne(userInventory);
            }

            await inventoryCollection.updateOne(
                { userId: userId, date: currentDate },
                { $set: { items: convertedItems } }
            );

            res.json({ message: 'Inventory image uploaded and analyzed successfully', analysis: structuredAnalysisResult });
        } catch (error) {
            return handleErrors(res, error, 'Error processing inventory image');
        } finally {
            if (inventoryImageFile && inventoryImageFile.path) {
                fs.unlink(inventoryImageFile.path, (err) => {
                    if (err) console.error('Error deleting file:', err);
                });
            }
        }
    });
}

module.exports = { handleInventoryUpload };
