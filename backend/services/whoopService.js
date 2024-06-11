const axios = require('axios');
const fetch = require('node-fetch');
const User = require('../models/User');
const { normalizeData, cleanData } = require('../utils/dataNormalization');

const refreshWhoopToken = async (userId) => {
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

  const body = new URLSearchParams(refreshParams);
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  try {
    const response = await axios.post(process.env.WHOOP_TOKEN_URL, body, { headers });
    const newTokens = response.data;

    if (newTokens.error) {
      throw new Error(`Error in refreshWhoopToken: ${newTokens.error}`);
    }

    await user.update({
      whoopAccessToken: newTokens.access_token,
      whoopRefreshToken: newTokens.refresh_token,
      whoopTokenExpires: new Date(Date.now() + newTokens.expires_in * 1000)
    });

    console.log(`Whoop token refreshed for user ${userId}:`, newTokens);
    return newTokens.access_token;
  } catch (error) {
    console.error(`Error refreshing Whoop token for user ${userId}:`, error.message);
    throw new Error(`Error in refreshWhoopToken: ${error.message}`);
  }
};

const fetchProfile = async (accessToken, userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');

  try {
    let response = await fetch('https://api.prod.whoop.com/developer/v1/user/profile/basic', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (response.status === 401) {
      console.log(`Token expired for user ${userId}. Refreshing token...`);
      accessToken = await refreshWhoopToken(userId);

      response = await fetch('https://api.prod.whoop.com/developer/v1/user/profile/basic', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (!response.ok) {
        const rawResponse = await response.text();
        console.error(`Error fetching profile for user ${userId}:`, rawResponse);
        throw new Error(`Error fetching profile: ${rawResponse}`);
      }

      const profile = await response.json();
      console.log(`Profile data for user ${userId}:`, profile);
      return profile;
    }

    const rawResponse = await response.text();
    if (!response.ok) {
      console.error(`Error fetching profile for user ${userId}:`, rawResponse);
      throw new Error(`Error fetching profile: ${rawResponse}`);
    }

    const profile = JSON.parse(rawResponse);
    console.log(`Profile data for user ${userId}:`, profile);
    return profile;
  } catch (error) {
    console.error('Error in fetchProfile:', error);
    throw error;
  }
};

const fetchCycles = async (accessToken, userId) => {
  try {
    const response = await fetch('https://api.prod.whoop.com/developer/v1/cycle', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const rawResponse = await response.text();
    if (response.status === 401) {
      console.error(`Error fetching cycles for user ${userId}:`, rawResponse);
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      console.error(`Error fetching cycles for user ${userId}:`, rawResponse);
      throw new Error(`Error fetching cycles: ${rawResponse}`);
    }

    const cycles = JSON.parse(rawResponse).records;
    console.log(`Cycles data for user ${userId}:`, cycles);
    return cleanData(normalizeData(cycles));
  } catch (error) {
    console.error('Error in fetchCycles:', error);
    throw error;
  }
};

const fetchRecoveries = async (accessToken, userId) => {
  try {
    const response = await fetch('https://api.prod.whoop.com/developer/v1/recovery', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const rawResponse = await response.text();
    if (response.status === 401) {
      console.error(`Error fetching recoveries for user ${userId}:`, rawResponse);
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      console.error(`Error fetching recoveries for user ${userId}:`, rawResponse);
      throw new Error(`Error fetching recoveries: ${rawResponse}`);
    }

    const recoveries = JSON.parse(rawResponse).records;
    console.log(`Recoveries data for user ${userId}:`, recoveries);
    return cleanData(normalizeData(recoveries));
  } catch (error) {
    console.error('Error in fetchRecoveries:', error);
    throw error;
  }
};

const fetchSleepData = async (accessToken, userId) => {
  try {
    const response = await fetch('https://api.prod.whoop.com/developer/v1/activity/sleep', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const rawResponse = await response.text();
    if (response.status === 401) {
      console.error(`Error fetching sleep data for user ${userId}:`, rawResponse);
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      console.error(`Error fetching sleep data for user ${userId}:`, rawResponse);
      throw new Error(`Error fetching sleep data: ${rawResponse}`);
    }

    const sleepData = JSON.parse(rawResponse).records;
    console.log(`Sleep data for user ${userId}:`, sleepData);
    return cleanData(normalizeData(sleepData));
  } catch (error) {
    console.error('Error in fetchSleepData:', error);
    throw error;
  }
};

const fetchWorkouts = async (accessToken, userId) => {
  try {
    const response = await fetch('https://api.prod.whoop.com/developer/v1/activity/workout', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const rawResponse = await response.text();
    if (response.status === 401) {
      console.error(`Error fetching workouts for user ${userId}:`, rawResponse);
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      console.error(`Error fetching workouts for user ${userId}:`, rawResponse);
      throw new Error(`Error fetching workouts: ${rawResponse}`);
    }

    const workouts = JSON.parse(rawResponse).records;
    console.log(`Workouts data for user ${userId}:`, workouts);
    return cleanData(normalizeData(workouts));
  } catch (error) {
    console.error('Error in fetchWorkouts:', error);
    throw error;
  }
};

module.exports = {
  fetchProfile,
  fetchCycles,
  fetchRecoveries,
  fetchSleepData,
  fetchWorkouts,
  refreshWhoopToken,
};
