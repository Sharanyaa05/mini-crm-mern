const jwt = require('jsonwebtoken');
const User = require('../modules/auth/user.model');
const jwtConfig = require('../config/jwt');

const protect = async (req, res, next) => {
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorized. No token.' });
  }
  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }
    req.user = { id: user._id, email: user.email, name: user.name };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized. Invalid token.' });
  }
};

module.exports = { protect };
