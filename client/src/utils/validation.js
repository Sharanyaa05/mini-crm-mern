export const MIN_PASSWORD_LENGTH = 8;

export const PASSWORD_RULES = [
  {
    id: 'length',
    message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
    test: (p) => p.length >= MIN_PASSWORD_LENGTH,
  },
  {
    id: 'lower',
    message: 'Password must contain at least one lowercase letter.',
    test: (p) => /[a-z]/.test(p),
  },
  {
    id: 'upper',
    message: 'Password must contain at least one uppercase letter.',
    test: (p) => /[A-Z]/.test(p),
  },
  {
    id: 'number',
    message: 'Password must contain at least one number.',
    test: (p) => /\d/.test(p),
  },
  {
    id: 'special',
    message: 'Password must contain at least one special character (!@#$%^&* etc.).',
    test: (p) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p),
  },
];

/**
 * Returns an array of validation error messages for the given password.
 * Returns null if password is valid or empty (no errors shown until user types).
 */
export function getPasswordErrors(password) {
  if (password == null || typeof password !== 'string' || password.length === 0) return null;
  const failed = PASSWORD_RULES.filter((r) => !r.test(password)).map((r) => r.message);
  return failed.length > 0 ? failed : null;
}

/**
 * Returns a single string of all password validation errors, or null if valid.
 * Useful for helper text below the password field.
 */
export function getPasswordErrorString(password) {
  const errors = getPasswordErrors(password);
  if (!errors || errors.length === 0) return null;
  return errors.join(' ');
}

/**
 * Returns true if password meets all rules.
 */
export function isPasswordValid(password) {
  return getPasswordErrors(password) === null;
}
