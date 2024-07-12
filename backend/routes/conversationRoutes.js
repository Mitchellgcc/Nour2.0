// Nour2.0/backend/routes/conversationRoutes.js
const express = require('express');
const { sendConversationDataToServer } = require('../controllers/conversationController');
const router = express.Router();

router.post('/conversation', sendConversationDataToServer);
router.post('/saveResponses', sendConversationDataToServer);

module.exports = router;
