// backend/controllers/whoopController.js
const axios = require('axios');
const querystring = require('querystring');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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

const MAX_ENTRIES = 3;

const logStep = (message, context) => {
  console.log(`[${new Date().toISOString()}] ${message}:`, context);
};

const loginUser = async (email, password) => {
  try {
    logStep('Attempting to log in user', { email });
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const response = await axios.post('http://localhost:5001/api/auth/login', {
      email,
      password,
    });
    const { accessToken, refreshToken } = response.data;
    logStep('Login successful', { email, accessToken, refreshToken });
    return { accessToken, refreshToken };
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error logging in user ${email}:`, error.message);
    throw new Error('Failed to log in user');
  }
};

const syncWhoopData = async (req, res) => {
  try {
    const user = req.user;
    logStep('Preparing to sync data', { userId: user.id });
    let accessToken = user.whoopAccessToken;

    if (!accessToken) {
      logStep('No valid Whoop access token', { userId: user.id });
      const tokens = await loginUser(user.email, 'Charlie123');
      accessToken = tokens.accessToken;
      await user.update({
        whoopAccessToken: tokens.accessToken,
        whoopRefreshToken: tokens.refreshToken,
      });
      logStep('Whoop tokens updated', { userId: user.id });
    }

    const fetchDataAndSave = async () => {
      try {
        logStep('Fetching profile', { userId: user.id });
        const profile = await fetchProfile(accessToken, user.id);
        logStep('Fetched profile data', { userId: user.id, profile });

        logStep('Fetching cycles', { userId: user.id });
        const cycles = await fetchCycles(accessToken, user.id);
        logStep('Fetched cycles data', { userId: user.id, cycles });

        logStep('Fetching recoveries', { userId: user.id });
        const recoveries = await fetchRecoveries(accessToken, user.id);
        logStep('Fetched recoveries data', { userId: user.id, recoveries });

        logStep('Fetching sleep data', { userId: user.id });
        const sleepData = await fetchSleepData(accessToken, user.id);
        logStep('Fetched sleep data', { userId: user.id, sleepData });

        logStep('Fetching workouts', { userId: user.id });
        const workouts = await fetchWorkouts(accessToken, user.id);
        logStep('Fetched workouts data', { userId: user.id, workouts });

        logStep('Finding existing Whoop data', { userId: user.id });
        const whoopData = await WhoopData.findOne({ userId: user.id });

        if (whoopData) {
          logStep('Updating existing Whoop data', { userId: user.id });
          whoopData.profile = profile;
          whoopData.cycles = limitArraySize(removeDuplicates(whoopData.cycles.concat(cycles)));
          whoopData.recoveries = limitArraySize(removeDuplicates(whoopData.recoveries.concat(recoveries)));
          whoopData.sleepData = limitArraySize(removeDuplicates(whoopData.sleepData.concat(sleepData)));
          whoopData.workouts = limitArraySize(removeDuplicates(whoopData.workouts.concat(workouts)));
          whoopData.updatedAt = new Date();
          await whoopData.save();
          logStep('Whoop data updated', { userId: user.id });
        } else {
          logStep('Creating new Whoop data record', { userId: user.id });
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
          logStep('Whoop data record created', { userId: user.id });
        }

        res.status(200).json({ message: 'Whoop data synced successfully' });
      } catch (error) {
        if (error.response && error.response.status === 401) {
          logStep('Access token expired', { userId: user.id });
          accessToken = await refreshWhoopToken(user.id);
          await fetchDataAndSave();
        } else if (error.response) {
          console.error(`[${new Date().toISOString()}] Error during data fetch for user ${user.id}:`, error.response.data);
        } else {
          console.error(`[${new Date().toISOString()}] Error during data fetch for user ${user.id}:`, error.message);
        }
        throw error;
      }
    };

    await fetchDataAndSave();
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error syncing Whoop data for user ${req.user.id}:`, error.message);
    res.status(500).json({ message: 'Failed to sync Whoop data', error: error.message });
  }
};

const sortByDate = (array) => {
  logStep('Sorting array by date', { array });
  return array.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
};

const removeDuplicates = (array) => {
  logStep('Removing duplicates from array', { array });
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
  logStep('Limiting array size', { array });
  const sortedArray = sortByDate(array);
  if (sortedArray.length > MAX_ENTRIES) {
    return sortedArray.slice(0, MAX_ENTRIES);
  }
  return sortedArray;
};

const handleRedirect = async (req, res) => {
  const code = req.query.code;
  const state = req.query.state;

  logStep('Received code and state from Whoop', { code, state });

  const tokenUrl = 'https://api.prod.whoop.com/oauth/oauth2/token';
  const redirectUri = process.env.WHOOP_REDIRECT_URI;

  const data = {
    client_id: process.env.WHOOP_CLIENT_ID,
    client_secret: process.env.WHOOP_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri
  };

  logStep('Sending token exchange request', { data });

  try {
    const response = await axios.post(tokenUrl, querystring.stringify(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    logStep('Token exchange response received', { responseData: response.data });

    const { access_token, refresh_token, expires_in } = response.data;

    logStep('Finding user with session ID', { state });
    const user = await User.findOne({ where: { sessionId: state } });

    if (user) {
      logStep('User found', { user });

      user.whoopAccessToken = access_token;
      user.whoopRefreshToken = refresh_token;
      user.whoopTokenExpires = new Date(Date.now() + expires_in * 1000);
      await user.save();

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Update the redirect to connect-apps
      logStep('Redirecting user to connect-apps', { userId: user.id });
      res.redirect(`http://localhost:3001/connect-apps?token=${token}`);
    } else {
      logStep('User not found for session ID', { state });
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error fetching tokens from WHOOP:`, error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Failed to exchange code for tokens' });
  }
};

module.exports = {
  syncWhoopData,
  handleRedirect,
  loginUser,
};
