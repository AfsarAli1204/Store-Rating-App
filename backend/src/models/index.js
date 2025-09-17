const sequelize = require('../config/database');
const User = require('./user.model');
const Store = require('./store.model');
const Rating = require('./rating.model');

const db = {};
db.Sequelize = require('sequelize');
db.sequelize = sequelize;

db.User = User;
db.Store = Store;
db.Rating = Rating;

// Relationships
db.User.hasMany(db.Store, { as: 'stores', foreignKey: 'ownerId' });
db.Store.belongsTo(db.User, { as: 'Owner', foreignKey: 'ownerId' });

db.User.hasMany(db.Rating, { as: 'ratings', foreignKey: 'userId' });
db.Rating.belongsTo(db.User, { as: 'User', foreignKey: 'userId' });

db.Store.hasMany(db.Rating, { as: 'ratings', foreignKey: 'storeId' });
db.Rating.belongsTo(db.Store, { as: 'Store', foreignKey: 'storeId' });

module.exports = db;