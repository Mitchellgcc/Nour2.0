const axios = require('axios');
const User = require('../models/User');
const { normalizeData, cleanData } = require('../utils/dataNormalization');

// Log each step with detailed context
const logStep = (message, context) => {
  console.log(`[${new Date().toISOString()}] ${message}:`, context);
};

// Refresh the Whoop token for a user
const refreshWhoopToken = async (userId) => {
  logStep('Attempting to refresh Whoop token', { userId });
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('User not found');
  }

  if (!user.whoopRefreshToken) {
    throw new Error('No refresh token available for the user');
  }

  const refreshParams = {
    grant_type: 'refresh_token',
    client_id: process.env.WHOOP_CLIENT_ID,
    client_secret: process.env.WHOOP_CLIENT_SECRET,
    refresh_token: user.whoopRefreshToken,
  };

  logStep('Prepared refresh token parameters', { refreshParams });

  const body = new URLSearchParams(refreshParams);
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  try {
    logStep('Sending request to refresh token', { url: process.env.WHOOP_TOKEN_URL, headers, body: body.toString() });
    const response = await axios.post(process.env.WHOOP_TOKEN_URL, body, { headers });
    const newTokens = response.data;

    if (!newTokens || newTokens.error) {
      throw new Error(`Error in refreshWhoopToken: ${newTokens ? newTokens.error : 'No tokens returned'}`);
    }

    logStep('Token refreshed successfully', { newTokens });

    await user.update({
      whoopAccessToken: newTokens.access_token,
      whoopRefreshToken: newTokens.refresh_token,
      whoopTokenExpires: new Date(Date.now() + newTokens.expires_in * 1000),
    });

    logStep('Updated user tokens in database', { userId });
    return newTokens.access_token;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error refreshing Whoop token for user ${userId}:`, error.response ? error.response.data : error.message);
    throw new Error(`Error in refreshWhoopToken: ${error.response ? error.response.data : error.message}`);
  }
};

// Fetch user profile from Whoop
const fetchProfile = async (accessToken, userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');

  try {
    logStep('Fetching profile from Whoop', { userId, accessToken });
    let response = await axios.get('https://api.prod.whoop.com/developer/v1/user/profile/basic', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response || response.status === 401) {
      logStep('Token expired, refreshing token', { userId });
      accessToken = await refreshWhoopToken(userId);

      logStep('Retrying profile fetch with new token', { userId, accessToken });
      response = await axios.get('https://api.prod.whoop.com/developer/v1/user/profile/basic', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    }

    if (!response || response.status !== 200 || !response.data) {
      logStep('Error fetching profile', { userId, response: response ? response.data : 'No response data' });
      throw new Error(`Error fetching profile: ${response ? response.data : 'No response data'}`);
    }

    logStep('Fetched profile data successfully', { userId, profile: response.data });
    return response.data;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error in fetchProfile for user ${userId}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

// Fetch cycles data from Whoop
const fetchCycles = async (accessToken, userId) => {
  try {
    logStep('Fetching cycles from Whoop', { userId, accessToken });
    const response = await axios.get('https://api.prod.whoop.com/developer/v1/cycle', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response || response.status === 401) {
      logStep('Unauthorized access when fetching cycles', { userId });
      throw new Error('Unauthorized');
    }

    if (!response || response.status !== 200 || !response.data || !response.data.records) {
      logStep('Error fetching cycles', { userId, response: response ? response.data : 'No response data' });
      throw new Error(`Error fetching cycles: ${response ? response.data : 'No response data'}`);
    }

    logStep('Fetched cycles data successfully', { userId, cycles: response.data.records });
    return cleanData(normalizeData(response.data.records));
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error in fetchCycles for user ${userId}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

// Fetch recovery data from Whoop
const fetchRecoveries = async (accessToken, userId) => {
  try {
    logStep('Fetching recoveries from Whoop', { userId, accessToken });
    const response = await axios.get('https://api.prod.whoop.com/developer/v1/recovery', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response || response.status === 401) {
      logStep('Unauthorized access when fetching recoveries', { userId });
      throw new Error('Unauthorized');
    }

    if (!response || response.status !== 200 || !response.data || !response.data.records) {
      logStep('Error fetching recoveries', { userId, response: response ? response.data : 'No response data' });
      throw new Error(`Error fetching recoveries: ${response ? response.data : 'No response data'}`);
    }

    logStep('Fetched recoveries data successfully', { userId, recoveries: response.data.records });
    return cleanData(normalizeData(response.data.records));
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error in fetchRecoveries for user ${userId}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

// Fetch sleep data from Whoop
const fetchSleepData = async (accessToken, userId) => {
  try {
    logStep('Fetching sleep data from Whoop', { userId, accessToken });
    const response = await axios.get('https://api.prod.whoop.com/developer/v1/activity/sleep', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response || response.status === 401) {
      logStep('Unauthorized access when fetching sleep data', { userId });
      throw new Error('Unauthorized');
    }

    if (!response || response.status !== 200 || !response.data || !response.data.records) {
      logStep('Error fetching sleep data', { userId, response: response ? response.data : 'No response data' });
      throw new Error(`Error fetching sleep data: ${response ? response.data : 'No response data'}`);
    }

    logStep('Fetched sleep data successfully', { userId, sleepData: response.data.records });
    return cleanData(normalizeData(response.data.records));
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error in fetchSleepData for user ${userId}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

// Fetch workouts data from Whoop
const fetchWorkouts = async (accessToken, userId) => {
  try {
    logStep('Fetching workouts from Whoop', { userId, accessToken });
    const response = await axios.get('https://api.prod.whoop.com/developer/v1/activity/workout', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response || response.status === 401) {
      logStep('Unauthorized access when fetching workouts', { userId });
      throw new Error('Unauthorized');
    }

    if (!response || response.status !== 200 || !response.data || !response.data.records) {
      logStep('Error fetching workouts', { userId, response: response ? response.data : 'No response data' });
      throw new Error(`Error fetching workouts: ${response ? response.data : 'No response data'}`);
    }

    logStep('Fetched workouts data successfully', { userId, workouts: response.data.records });
    return cleanData(normalizeData(response.data.records));
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error in fetchWorkouts for user ${userId}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

module.exports = {
  refreshWhoopToken,
  fetchProfile,
  fetchCycles,
  fetchRecoveries,
  fetchSleepData,
  fetchWorkouts,
};
