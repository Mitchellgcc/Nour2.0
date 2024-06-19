const handleAxiosError = (error, userId, context) => {
    if (error.response) {
        // Server responded with a status other than 200 range
        console.error(`[${new Date().toISOString()}] Error in ${context} for user ${userId}:`, error.response.data, error.response.status);
    } else if (error.request) {
        // No response received
        console.error(`[${new Date().toISOString()}] No response in ${context} for user ${userId}:`, error.request);
    } else {
        // Something else caused the error
        console.error(`[${new Date().toISOString()}] Error in ${context} for user ${userId}:`, error.message);
    }
};

module.exports = handleAxiosError;
