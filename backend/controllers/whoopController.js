const axios = require('axios');
const querystring = require('querystring');
const jwt = require('jsonwebtoken');
const { 
  fetchProfile, 
  fetchCycles, 
  fetchRecoveries, 
  fetchSleepData, 
  fetchWorkouts, 
  refreshWhoopToken 
} = require('../services/whoopService');
const WhoopData = require('../models/WhoopData');
const User = require('../models/User');

const MAX_ENTRIES = 3; // Maximum number of entries to keep in each array

const loginUser = async (email, password) => {
  try {
    const response = await axios.post('http://localhost:5001/api/auth/login', {
      email,
      password,
    });

    const { accessToken, refreshToken } = response.data;
    return { accessToken, refreshToken };
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error logging in user ${email}:`, error.message, error.stack);
    throw new Error('Failed to log in user');
  }
};

const syncWhoopData = async (req, res) => {
  try {
    const user = req.user;
    let accessToken = user.whoopAccessToken;

    if (!accessToken) {
      console.log(`[${new Date().toISOString()}] No valid Whoop access token for user ${user.id}, logging in...`);
      // Replace 'Charlie123' with a secure method of password retrieval
      const tokens = await loginUser(user.email, 'Charlie123');
      accessToken = tokens.accessToken;
      await user.update({
        whoopAccessToken: tokens.accessToken,
        whoopRefreshToken: tokens.refreshToken,
      });
    }

    // Function to handle data fetching and updating
    const fetchDataAndSave = async () => {
      try {
        const profile = await fetchProfile(accessToken, user.id);
        const cycles = await fetchCycles(accessToken, user.id);
        const recoveries = await fetchRecoveries(accessToken, user.id);
        const sleepData = await fetchSleepData(accessToken, user.id);
        const workouts = await fetchWorkouts(accessToken, user.id);

        const whoopData = await WhoopData.findOne({ userId: user.id });

        if (whoopData) {
          whoopData.profile = profile;
          whoopData.cycles = limitArraySize(removeDuplicates(whoopData.cycles.concat(cycles)));
          whoopData.recoveries = limitArraySize(removeDuplicates(whoopData.recoveries.concat(recoveries)));
          whoopData.sleepData = limitArraySize(removeDuplicates(whoopData.sleepData.concat(sleepData)));
          whoopData.workouts = limitArraySize(removeDuplicates(whoopData.workouts.concat(workouts)));
          whoopData.updatedAt = new Date();
          await whoopData.save();
          console.log(`[${new Date().toISOString()}] Updated Whoop data for user ${user.id}`);
        } else {
          await WhoopData.create({
            userId: user.id,
            profile,
            cycles: limitArraySize(removeDuplicates(cycles)),
            recoveries: limitArraySize(removeDuplicates(recoveries)),
            sleepData: limitArraySize(removeDuplicates(sleepData)),
            workouts: limitArraySize(removeDuplicates(workouts)),
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          console.log(`[${new Date().toISOString()}] Created new Whoop data record for user ${user.id}`);
        }

        res.status(200).json({ message: 'Whoop data synced successfully' });
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log(`[${new Date().toISOString()}] Access token expired for user ${user.id}, refreshing token...`);
          accessToken = await refreshWhoopToken(user.id);
          await fetchDataAndSave();
        } else {
          console.error(`[${new Date().toISOString()}] Error during data fetch for user ${user.id}:`, error.message, error.stack);
          throw error;
        }
      }
    };

    await fetchDataAndSave();
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error syncing Whoop data for user ${req.user.id}:`, error.message, error.stack);
    res.status(500).json({ message: 'Failed to sync Whoop data', error: error.message });
  }
};

const sortByDate = (array) => {
  return array.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
};

const removeDuplicates = (array) => {
  const uniqueDates = new Set();
  return array.filter(item => {
    const date = new Date(item.updated_at).toISOString().split('T')[0];
    if (uniqueDates.has(date)) {
      return false;
    } else {
      uniqueDates.add(date);
      return true;
    }
  });
};

const limitArraySize = (array) => {
  const sortedArray = sortByDate(array);
  if (sortedArray.length > MAX_ENTRIES) {
    return sortedArray.slice(0, MAX_ENTRIES); // Take the most recent entries
  }
  return sortedArray;
};

const handleRedirect = async (req, res) => {
  const code = req.query.code;
  const state = req.query.state;

  console.log("Received code:", code);
  console.log("Received state:", state);

  const tokenUrl = 'https://api.prod.whoop.com/oauth/oauth2/token';
  const redirectUri = process.env.WHOOP_REDIRECT_URI;

  const data = {
    client_id: process.env.WHOOP_CLIENT_ID,
    client_secret: process.env.WHOOP_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri
  };

  console.log("Sending token exchange request with data:", data);

  try {
    const response = await axios.post(tokenUrl, querystring.stringify(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    console.log("Token exchange response:", response.data);

    const { access_token, refresh_token, expires_in } = response.data;

    console.log("Attempting to find user with session ID:", state);
    const user = await User.findOne({ where: { sessionId: state } });

    if (user) {
      console.log("User found:", user);

      user.whoopAccessToken = access_token;
      user.whoopRefreshToken = refresh_token;
      user.whoopTokenExpires = new Date(Date.now() + expires_in * 1000);
      await user.save();

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.redirect(`/profile?token=${token}`);
    } else {
      console.log("User not found for session ID:", state);
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error fetching tokens from WHOOP:`, error.response ? error.response.data : error.message, error.stack);
    res.status(500).json({ message: 'Failed to exchange code for tokens' });
  }
};

module.exports = {
  syncWhoopData,
  handleRedirect,
  loginUser, // Export loginUser function for use in the scheduler
};
