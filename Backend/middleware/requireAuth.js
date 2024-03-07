const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const requireAuth = async (req, res, next) => {
  try {
    // Extract the authorization header
    const { authorization } = req.headers;

    // Log the received token
    console.log('Received token:', authorization);

    // Check if the authorization header is present
    if (!authorization) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    // Extract the token from the "Bearer" token format
    const token = authorization.split(' ')[1];

    // Log the token being verified
    console.log('Verifying token:', token);

    // Verify the token using the secret key
    const { _id } = jwt.verify(token, process.env.SECRET);

    // Attach the user ID to the request for future use
    req.user = await User.findOne({ _id }).select('_id');

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error);

    // Handle different types of JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired' });
    }

    // For other errors, return a generic 401 error
    res.status(401).json({ error: 'Request is not authorized' });
  }
};

module.exports = requireAuth;

