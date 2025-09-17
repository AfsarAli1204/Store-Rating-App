const { Rating } = require('../models');

const submitOrUpdateRating = async (req, res) => {
    try {
        const userId = req.userId; // From verifyToken middleware
        const { storeId, rating } = req.body;

        if (!storeId || !rating) {
            return res.status(400).send({ message: "Store ID and rating are required." });
        }

        // Find if a rating already exists for this user and store
        const existingRating = await Rating.findOne({
            where: {
                userId: userId,
                storeId: storeId
            }
        });

        if (existingRating) {
            // If it exists, update it
            existingRating.rating = rating;
            await existingRating.save();
            res.status(200).send({ message: "Rating updated successfully!", rating: existingRating });
        } else {
            // If it doesn't exist, create a new one
            const newRating = await Rating.create({
                userId: userId,
                storeId: storeId,
                rating: rating
            });
            res.status(201).send({ message: "Rating submitted successfully!", rating: newRating });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

module.exports = {
    submitOrUpdateRating,
};

