// apiKeyMiddleware.js

//looks for API KEY in .env
require('dotenv').config();

// // Define the middleware function  
const apiKeyMiddleware = (req, res, next) => {
    // Retrieve the API key from the request header
    const apiKeyFromHeader = req.headers['x-api-key'];
    
    // Retrieve the API key from the query parameters
    const apiKeyFromQuery = req.query['x-api-key'];

    // Retrieve the expected API key from the environment variable
    const expectedApiKey = process.env.API_KEY;

    // Check if the API key is missing in both the header and query parameters
    if (!apiKeyFromHeader && !apiKeyFromQuery) {
        // Send a 401 Unauthorized response if the API key is missing
        return res.status(401).send('API Key is missing');
    }

    // Check if the API key from the header or query parameter matches the expected value
    if (apiKeyFromHeader !== expectedApiKey && apiKeyFromQuery !== expectedApiKey) {
        // Send a 403 Forbidden response if the API key is invalid
        return res.status(403).send('API Key is invalid');
    }

    // Call the next middleware or endpoint handler
    next();

};    

// Export the middleware function
module.exports = apiKeyMiddleware;