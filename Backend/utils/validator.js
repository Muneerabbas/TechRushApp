const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateName = (name) => {
  return name && name.length >= 2;
};

const validateRole = (role) => {
  const validRoles = ['Student', 'Club Organizer', 'Admin'];
  return !role || validRoles.includes(role);
};

const validateRegistration = (body) => {
  const errors = [];
  if (!validateName(body.name)) errors.push('Name must be at least 2 characters');
  if (!validateEmail(body.email)) errors.push('Invalid email format');
  if (!validatePassword(body.password)) errors.push('Password must be at least 6 characters');
  if (!validateRole(body.role)) errors.push('Invalid role');
  return errors;
};

const validateLogin = (body) => {
  const errors = [];
  if (!validateEmail(body.email)) errors.push('Invalid email format');
  if (!validatePassword(body.password)) errors.push('Password must be at least 6 characters');
  return errors;
};

module.exports = {
  validateEmail,
  validatePassword,
  validateName,
  validateRole,
  validateRegistration,
  validateLogin,
};