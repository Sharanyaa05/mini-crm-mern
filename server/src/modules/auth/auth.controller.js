const authService = require('./auth.service');

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_RULES = [
  { test: (p) => p.length >= PASSWORD_MIN_LENGTH, message: `At least ${PASSWORD_MIN_LENGTH} characters` },
  { test: (p) => /[a-z]/.test(p), message: 'One lowercase letter' },
  { test: (p) => /[A-Z]/.test(p), message: 'One uppercase letter' },
  { test: (p) => /\d/.test(p), message: 'One number' },
  { test: (p) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p), message: 'One special character' },
];

function validatePassword(password) {
  if (!password) return 'Password is required';
  const failed = PASSWORD_RULES.filter((r) => !r.test(password)).map((r) => r.message);
  if (failed.length) return failed.join('. ');
  return null;
}

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    const pwdError = validatePassword(password);
    if (pwdError) {
      return res.status(400).json({ message: pwdError });
    }
    const result = await authService.register(name, email, password);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const result = await authService.login(email, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await authService.listUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe, getUsers };
