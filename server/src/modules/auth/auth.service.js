const jwt = require('jsonwebtoken');
const User = require('./user.model');
const jwtConfig = require('../../config/jwt');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
};

const register = async (name, email, password) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email already registered');
  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);
  const userObj = user.toObject();
  delete userObj.password;
  return { user: userObj, token };
};

const login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new Error('Invalid email or password');
  const valid = await user.comparePassword(password);
  if (!valid) throw new Error('Invalid email or password');
  const token = generateToken(user._id);
  const userObj = user.toObject();
  delete userObj.password;
  return { user: userObj, token };
};

const getProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) throw new Error('User not found');
  return user;
};

const listUsers = async () => {
  return User.find().select('name email').sort({ name: 1 }).lean();
};

module.exports = { register, login, getProfile, generateToken, listUsers };
