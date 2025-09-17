const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');
const { Store, Rating } = require('../models');
const { Op } = require('sequelize');

// --- The controller logic is now inside this file ---
const getAllStoresHandler = async (req, res) => {
    try {
        const { search } = req.query;
        const userId = req.userId;

        let whereClause = {};
        if (search) {
            whereClause = {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { address: { [Op.like]: `%${search}%` } }
                ]
            };
        }

        const stores = await Store.findAll({
            where: whereClause,
            include: [{
                model: Rating,
                as: 'ratings',
                attributes: ['rating', 'userId']
            }]
        });

        const processedStores = stores.map(store => {
            const storeJSON = store.toJSON();
            let totalRating = 0;
            let userSubmittedRating = 0;

            if (storeJSON.ratings && storeJSON.ratings.length > 0) {
                storeJSON.ratings.forEach(rating => {
                    totalRating += rating.rating;
                    if (rating.userId === userId) {
                        userSubmittedRating = rating.rating;
                    }
                });
                storeJSON.overallRating = totalRating / storeJSON.ratings.length;
            } else {
                storeJSON.overallRating = 0;
            }
            
            delete storeJSON.ratings;
            storeJSON.userSubmittedRating = userSubmittedRating;
            return storeJSON;
        });

        res.status(200).send(processedStores);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// This connects the URL to the handler function defined above
router.get('/', verifyToken, getAllStoresHandler);

module.exports = router;

