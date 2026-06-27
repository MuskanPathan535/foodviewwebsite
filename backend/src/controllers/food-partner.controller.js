const foodPartnerModel = require('../models/foodpartner.model');
const foodModel = require('../models/food.model');

async function getFoodPartnerById(req, res) {

    const foodPartnerId = req.params.id;

    const foodPartner = await foodPartnerModel.findById(foodPartnerId)
    const foodItemsByFoodPartner = await foodModel.find({ foodPartner: foodPartnerId })

    if (!foodPartner) {
        return res.status(404).json({ message: "Food partner not found" });
    }

   const totalMeals = foodItemsByFoodPartner.length;

   const customersServed = foodItemsByFoodPartner.reduce((sum, item) => {
    return sum + item.likeCount;
   }, 0);

    res.status(200).json({
        message: "Food partner retrieved successfully",
        foodPartner: {
            ...foodPartner.toObject(),
            foodItems: foodItemsByFoodPartner,
            totalMeals,
            customersServed
        }

    });
}

module.exports = {
    getFoodPartnerById
};