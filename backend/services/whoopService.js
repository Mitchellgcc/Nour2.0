const axios = require('axios');
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
      whoopTokenExpires: new Date(Date.now() + newTokens.expires_in * 1000),
    });

    console.log(`[${new Date().toISOString()}] Whoop token refreshed for user ${userId}:`, newTokens);
    return newTokens.access_token;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error refreshing Whoop token for user ${userId}:`, error.response ? error.response.data : error.message, error.stack);
    throw new Error(`Error in refreshWhoopToken: ${error.response ? error.response.data : error.message}`);
  }
};

const fetchProfile = async (accessToken, userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');

  try {
    let response = await axios.get('https://api.prod.whoop.com/developer/v1/user/profile/basic', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.status === 401) {
      console.log(`[${new Date().toISOString()}] Token expired for user ${userId}. Refreshing token...`);
      accessToken = await refreshWhoopToken(userId);

      response = await axios.get('https://api.prod.whoop.com/developer/v1/user/profile/basic', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    }

    if (response.status !== 200) {
      console.error(`[${new Date().toISOString()}] Error fetching profile for user ${userId}:`, response.data);
      throw new Error(`Error fetching profile: ${response.data}`);
    }

    const profile = response.data;
    console.log(`[${new Date().toISOString()}] Profile data for user ${userId}:`, profile);
    return profile;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error in fetchProfile for user ${userId}:`, error.response ? error.response.data : error.message, error.stack);
    throw error;
  }
};

const fetchCycles = async (accessToken, userId) => {
  try {
    const response = await axios.get('https://api.prod.whoop.com/developer/v1/cycle', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.status === 401) {
      console.error(`[${new Date().toISOString()}] Error fetching cycles for user ${userId}: Unauthorized`);
      throw new Error('Unauthorized');
    }

    if (response.status !== 200) {
      console.error(`[${new Date().toISOString()}] Error fetching cycles for user ${userId}:`, response.data);
      throw new Error(`Error fetching cycles: ${response.data}`);
    }

    const cycles = response.data.records;
    console.log(`[${new Date().toISOString()}] Cycles data for user ${userId}:`, cycles);
    return cleanData(normalizeData(cycles));
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error in fetchCycles for user ${userId}:`, error.response ? error.response.data : error.message, error.stack);
    throw error;
  }
};

const fetchRecoveries = async (accessToken, userId) => {
  try {
    const response = await axios.get('https://api.prod.whoop.com/developer/v1/recovery', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.status === 401) {
      console.error(`[${new Date().toISOString()}] Error fetching recoveries for user ${userId}: Unauthorized`);
      throw new Error('Unauthorized');
    }

    if (response.status !== 200) {
      console.error(`[${new Date().toISOString()}] Error fetching recoveries for user ${userId}:`, response.data);
      throw new Error(`Error fetching recoveries: ${response.data}`);
    }

    const recoveries = response.data.records;
    console.log(`[${new Date().toISOString()}] Recoveries data for user ${userId}:`, recoveries);
    return cleanData(normalizeData(recoveries));
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error in fetchRecoveries for user ${userId}:`, error.response ? error.response.data : error.message, error.stack);
    throw error;
  }
};

const fetchSleepData = async (accessToken, userId) => {
  try {
    const response = await axios.get('https://api.prod.whoop.com/developer/v1/activity/sleep', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.status === 401) {
      console.error(`[${new Date().toISOString()}] Error fetching sleep data for user ${userId}: Unauthorized`);
      throw new Error('Unauthorized');
    }

    if (response.status !== 200) {
      console.error(`[${new Date().toISOString()}] Error fetching sleep data for user ${userId}:`, response.data);
      throw new Error(`Error fetching sleep data: ${response.data}`);
    }

    const sleepData = response.data.records;
    console.log(`[${new Date().toISOString()}] Sleep data for user ${userId}:`, sleepData);
    return cleanData(normalizeData(sleepData));
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error in fetchSleepData for user ${userId}:`, error.response ? error.response.data : error.message, error.stack);
    throw error;
  }
};

const fetchWorkouts = async (accessToken, userId) => {
  try {
    const response = await axios.get('https://api.prod.whoop.com/developer/v1/activity/workout', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.status === 401) {
      console.error(`[${new Date().toISOString()}] Error fetching workouts for user ${userId}: Unauthorized`);
      throw new Error('Unauthorized');
    }

    if (response.status !== 200) {
      console.error(`[${new Date().toISOString()}] Error fetching workouts for user ${userId}:`, response.data);
      throw new Error(`Error fetching workouts: ${response.data}`);
    }

    const workouts = response.data.records;
    console.log(`[${new Date().toISOString()}] Workouts data for user ${userId}:`, workouts);
    return cleanData(normalizeData(workouts));
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error in fetchWorkouts for user ${userId}:`, error.response ? error.response.data : error.message, error.stack);
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
