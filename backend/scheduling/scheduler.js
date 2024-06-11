const cron = require('node-cron');
const { syncWhoopData } = require('../controllers/whoopController');
const { deriveInsights } = require('../services/recommendationEngine');
const User = require('../models/User');
const WhoopData = require('../models/WhoopData');
const logger = require('../config/logger');

// Function to normalize and clean data
const normalizeData = (data) => {
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  const roundNumber = (num) => Math.round(num * 100) / 100;
  const ensureMilliseconds = (value) => value * 1000; // Assuming value is in seconds, convert to milliseconds

  // Normalize profile data
  const normalizeProfile = (profile) => {
    return {
      ...profile,
      user_id: profile.user_id.toString(), // Ensure user_id is a string
      email: profile.email.toLowerCase(), // Ensure email is lowercase
      first_name: capitalize(profile.first_name),
      last_name: capitalize(profile.last_name),
    };
  };

  // Normalize cycle data
  const normalizeCycles = (cycles) => {
    return cycles.map(cycle => ({
      ...cycle,
      created_at: new Date(cycle.created_at).toISOString(),
      updated_at: new Date(cycle.updated_at).toISOString(),
      start: new Date(cycle.start).toISOString(),
      end: new Date(cycle.end).toISOString(),
      score: {
        ...cycle.score,
        strain: roundNumber(cycle.score.strain),
        kilojoule: roundNumber(cycle.score.kilojoule),
        average_heart_rate: roundNumber(cycle.score.average_heart_rate),
        max_heart_rate: roundNumber(cycle.score.max_heart_rate),
      },
    }));
  };

  // Normalize recovery data
  const normalizeRecoveries = (recoveries) => {
    return recoveries.map(recovery => ({
      ...recovery,
      created_at: new Date(recovery.created_at).toISOString(),
      updated_at: new Date(recovery.updated_at).toISOString(),
      score: {
        ...recovery.score,
        recovery_score: roundNumber(recovery.score.recovery_score),
        resting_heart_rate: roundNumber(recovery.score.resting_heart_rate),
        hrv_rmssd_milli: roundNumber(recovery.score.hrv_rmssd_milli),
        spo2_percentage: roundNumber(recovery.score.spo2_percentage),
        skin_temp_celsius: roundNumber(recovery.score.skin_temp_celsius),
      },
    }));
  };

  // Normalize sleep data
  const normalizeSleepData = (sleepData) => {
    return sleepData.map(sleep => ({
      ...sleep,
      created_at: new Date(sleep.created_at).toISOString(),
      updated_at: new Date(sleep.updated_at).toISOString(),
      start: new Date(sleep.start).toISOString(),
      end: new Date(sleep.end).toISOString(),
      score: {
        ...sleep.score,
        stage_summary: {
          ...sleep.score.stage_summary,
          total_in_bed_time_milli: ensureMilliseconds(sleep.score.stage_summary.total_in_bed_time_milli),
          total_awake_time_milli: ensureMilliseconds(sleep.score.stage_summary.total_awake_time_milli),
          total_light_sleep_time_milli: ensureMilliseconds(sleep.score.stage_summary.total_light_sleep_time_milli),
          total_slow_wave_sleep_time_milli: ensureMilliseconds(sleep.score.stage_summary.total_slow_wave_sleep_time_milli),
          total_rem_sleep_time_milli: ensureMilliseconds(sleep.score.stage_summary.total_rem_sleep_time_milli),
        },
        sleep_needed: {
          ...sleep.score.sleep_needed,
          baseline_milli: ensureMilliseconds(sleep.score.sleep_needed.baseline_milli),
          need_from_sleep_debt_milli: ensureMilliseconds(sleep.score.sleep_needed.need_from_sleep_debt_milli),
          need_from_recent_strain_milli: ensureMilliseconds(sleep.score.sleep_needed.need_from_recent_strain_milli),
        },
        respiratory_rate: roundNumber(sleep.score.respiratory_rate),
        sleep_performance_percentage: roundNumber(sleep.score.sleep_performance_percentage),
        sleep_consistency_percentage: roundNumber(sleep.score.sleep_consistency_percentage),
        sleep_efficiency_percentage: roundNumber(sleep.score.sleep_efficiency_percentage),
      },
    }));
  };

  // Normalize workout data
  const normalizeWorkouts = (workouts) => {
    return workouts.map(workout => ({
      ...workout,
      created_at: new Date(workout.created_at).toISOString(),
      updated_at: new Date(workout.updated_at).toISOString(),
      start: new Date(workout.start).toISOString(),
      end: new Date(workout.end).toISOString(),
      score: {
        ...workout.score,
        strain: roundNumber(workout.score.strain),
        average_heart_rate: roundNumber(workout.score.average_heart_rate),
        max_heart_rate: roundNumber(workout.score.max_heart_rate),
        kilojoule: roundNumber(workout.score.kilojoule),
        percent_recorded: roundNumber(workout.score.percent_recorded),
        distance_meter: roundNumber(workout.score.distance_meter),
        altitude_gain_meter: roundNumber(workout.score.altitude_gain_meter),
        altitude_change_meter: roundNumber(workout.score.altitude_change_meter),
        zone_duration: {
          ...workout.score.zone_duration,
          zone_zero_milli: ensureMilliseconds(workout.score.zone_duration.zone_zero_milli),
          zone_one_milli: ensureMilliseconds(workout.score.zone_duration.zone_one_milli),
          zone_two_milli: ensureMilliseconds(workout.score.zone_duration.zone_two_milli),
          zone_three_milli: ensureMilliseconds(workout.score.zone_duration.zone_three_milli),
          zone_four_milli: ensureMilliseconds(workout.score.zone_duration.zone_four_milli),
          zone_five_milli: ensureMilliseconds(workout.score.zone_duration.zone_five_milli),
        },
      },
    }));
  };

  // Normalize the entire data object
  return {
    ...data,
    profile: normalizeProfile(data.profile),
    cycles: normalizeCycles(data.cycles),
    recoveries: normalizeRecoveries(data.recoveries),
    sleepData: normalizeSleepData(data.sleepData),
    workouts: normalizeWorkouts(data.workouts),
    createdAt: new Date(data.createdAt).toISOString(),
    updatedAt: new Date(data.updatedAt).toISOString(),
  };
};

const syncWhoopDataForAllUsers = async () => {
  logger.info('Running scheduled job for Whoop data sync');
  const users = await User.findAll();
  for (const user of users) {
    try {
      if (user.whoopAccessToken) {
        logger.info(`Syncing data for user: ${user.id}`);
        const userReq = { user: user };
        const whoopData = await syncWhoopData(userReq, null); // Fetch the data

        if (whoopData) {
          const normalizedData = normalizeData(whoopData); // Normalize and clean the data
          // Store the normalized data in MongoDB
          await WhoopData.updateOne(
            { userId: user.id },
            { $set: normalizedData },
            { upsert: true }
          );
          logger.info(`Data for user ${user.id} normalized and stored successfully`);
        }
      } else {
        logger.info(`User ${user.id} does not have a valid Whoop access token.`);
      }
    } catch (error) {
      logger.error('Error during data synchronization:', error);
    }
  }
  await deriveInsights(); // Derive insights after syncing data
};

// Schedule to run every 10 seconds
cron.schedule('*/10 * * * * *', syncWhoopDataForAllUsers);

module.exports = {
  syncWhoopDataForAllUsers,
};
