const checkRole = (requiredRole) => {
  return (req, res, next) => {
    if (req.userRole !== requiredRole) {
      return res.status(403).send({ message: `Access denied. Requires ${requiredRole} role.` });
    }
    next();
  };
};

console.log('role.middleware.js loaded. Is checkRole a function?', typeof checkRole === 'function');

module.exports = checkRole;
