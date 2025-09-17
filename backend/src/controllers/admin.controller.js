const { User, Store, Rating } = require('../models');
const { Op } = require('sequelize');

const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalStores = await Store.count();
        const totalRatings = await Rating.count();
        res.status(200).send({ totalUsers, totalStores, totalRatings });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const { name, email, role } = req.query;
        let whereClause = {};
        if (name) whereClause.name = { [Op.like]: `%${name}%` };
        if (email) whereClause.email = { [Op.like]: `%${email}%` };
        if (role) whereClause.role = role;
        const users = await User.findAll({ where: whereClause, attributes: { exclude: ['password'] } });
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const createUser = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;
        await User.create({ name, email, password, address, role });
        res.status(201).send({ message: "User created successfully." });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).send({ message: "A user with this email already exists." });
        }
        res.status(500).send({ message: error.message });
    }
};

const getStores = async (req, res) => {
    try {
        const stores = await Store.findAll({
            include: [{ model: User, as: 'Owner', attributes: ['name'] }]
        });
        res.status(200).send(stores);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const createStore = async (req, res) => {
    try {
        const { name, email, address, ownerId } = req.body;
        const owner = await User.findOne({ where: { id: ownerId, role: 'Store Owner' } });
        if (!owner) {
            return res.status(404).send({ message: "Selected owner not found or is not a Store Owner." });
        }
        await Store.create({ name, email, address, ownerId });
        res.status(201).send({ message: "Store created successfully." });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).send({ message: "A store with this email already exists." });
        }
        res.status(500).send({ message: error.message });
    }
};

module.exports = {
    getDashboardStats,
    getAllUsers,
    createUser,
    getStores,
    createStore,
};

