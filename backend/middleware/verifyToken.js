const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  // Get token from cookie instead of headers
  const token = req.cookies?.token;

  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    req.user = payload; 
    // user info from token
    next();
  });
};

module.exports = verifyToken;
