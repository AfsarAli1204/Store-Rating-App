const { Store, Rating, User } = require('../models');

const getDashboard = async (req, res) => {
    try {
        const ownerId = req.userId;

        const store = await Store.findOne({
            where: { ownerId: ownerId }
        });

        if (!store) {
            return res.status(404).send({ message: "No store found for this owner." });
        }

        const ratings = await Rating.findAll({
            where: { storeId: store.id },
            include: [{
                model: User,
                as: 'User',
                attributes: ['name']
            }]
        });

        let averageRating = 0;
        if (ratings.length > 0) {
            const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
            averageRating = (totalRating / ratings.length).toFixed(1);
        }

        res.status(200).send({
            storeName: store.name,
            averageRating: parseFloat(averageRating),
            usersWhoRated: ratings
        });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

module.exports = {
    getDashboard,
};

