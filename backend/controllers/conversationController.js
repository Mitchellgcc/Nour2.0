const mongoose = require('mongoose');
const axios = require('axios');
const FormData = require('form-data');
const User = require('../models/User');

const conversationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now },
    transcription: { type: String, required: true },
    age: { type: Number },
    gender: { type: String },
    height: { type: Number },
    weight: { type: Number },
    healthConditions: { type: [String] },
    medications: { type: [String] },
    dietaryPreferences: { type: String },
});

const Conversation = mongoose.model('Conversation', conversationSchema);

const saveTranscription = (transcriptionText) => {
    const conversationStep = {
        timestamp: new Date().toISOString(),
        transcription: transcriptionText
    };
    conversationData.push(conversationStep);
};

const parseTranscription = (transcriptionText, userResponses) => {
    if (userResponses.ageGender === undefined && /(\d+)\s*(male|female)/i.test(transcriptionText)) {
        const [, age, gender] = transcriptionText.match(/(\d+)\s*(male|female)/i);
        userResponses.ageGender = { age: parseInt(age, 10), gender };
    }
    if (userResponses.heightWeight === undefined && /(\d+)\s*foot\s*(\d+)\s*inches\s*(\d+)\s*kilograms/i.test(transcriptionText)) {
        const [, feet, inches, weight] = transcriptionText.match(/(\d+)\s*foot\s*(\d+)\s*inches\s*(\d+)\s*kilograms/i);
        const height = (parseInt(feet, 10) * 12) + parseInt(inches, 10);
        userResponses.heightWeight = { height, weight: parseInt(weight, 10) };
    }
};

const isValidUUID = (id) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
};

const sendConversationDataToServer = async (req, res) => {
    try {
        console.log('Received conversation data:', req.body.conversationData);
        const { userId, conversationData } = req.body;

        if (!isValidUUID(userId) && !mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error(`Invalid UUID or ObjectId format for userId: ${userId}`);
        }

        const userResponses = {};
        const savedConversations = [];
        for (const step of conversationData) {
            parseTranscription(step.transcription, userResponses);
            console.log('Parsed transcription:', userResponses);
            const conversation = new Conversation({ userId, ...step });
            await conversation.save();
            savedConversations.push(conversation);
        }

        console.log('User responses before saving:', userResponses);

        if (isValidUUID(userId)) {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error(`User with ID ${userId} not found`);
            }
            if (userResponses.ageGender) {
                user.age = userResponses.ageGender.age;
                user.gender = userResponses.ageGender.gender;
            }
            if (userResponses.heightWeight) {
                user.height = userResponses.heightWeight.height;
                user.weight = userResponses.heightWeight.weight;
            }
            await user.save();
            console.log('User updated:', user);
        } else {
            console.log(`Skipping user update for non-UUID userId: ${userId}`);
        }

        res.status(200).json({ message: 'Conversation data received', data: savedConversations });
    } catch (error) {
        console.error('Error sending conversation data to server:', error);
        res.status(500).json({ message: 'Error saving conversation data', error: error.message });
    }
};

const fetchTTS = async (text) => {
    const apiKey = process.env.OPENAI_API_KEY;
    const response = await axios.post('https://api.openai.com/v1/audio/speech', {
        model: "tts-1",
        voice: "alloy",
        input: text
    }, {
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
    });

    if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.data;
};

const transcribeAudio = async (audioBlob) => {
    const apiKey = process.env.OPENAI_API_KEY;
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio/webm');
    formData.append('model', 'whisper-1');

    const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            ...formData.getHeaders()
        }
    });

    if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.data;
};

module.exports = {
    saveTranscription,
    sendConversationDataToServer,
    fetchTTS,
    transcribeAudio
};
