const { Store, Rating, User } = require('../models');
const { Op } = require('sequelize');

// Controller for Normal Users to get a list of stores
const getAllStores = async (req, res) => {
    try {
        const { search } = req.query;
        const userId = req.userId; // This is attached by the verifyToken middleware

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
                attributes: ['rating', 'userId'] // Include userId to find the user's rating
            }]
        });

        // Process each store to calculate average rating and find user's specific rating
        const processedStores = stores.map(store => {
            const storeJSON = store.toJSON();
            let totalRating = 0;
            let userSubmittedRating = 0;

            if (storeJSON.ratings && storeJSON.ratings.length > 0) {
                storeJSON.ratings.forEach(rating => {
                    totalRating += rating.rating;
                    // Check if this rating belongs to the currently logged-in user
                    if (rating.userId === userId) {
                        userSubmittedRating = rating.rating;
                    }
                });
                storeJSON.overallRating = totalRating / storeJSON.ratings.length;
            } else {
                storeJSON.overallRating = 0;
            }
            
            delete storeJSON.ratings; // Clean up the output
            storeJSON.userSubmittedRating = userSubmittedRating;

            return storeJSON;
        });

        res.status(200).send(processedStores);

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

module.exports = {
    getAllStores,
};

