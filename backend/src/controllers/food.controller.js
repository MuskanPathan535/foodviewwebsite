// const foodModel = require('../models/food.model');
// const storageService = require('../services/storage.service');
// const { v4: uuid } = require("uuid")

// async function createFood(req, res) {
//     console.log(req.foodPartner)
//     console.log(req.body)
//     console.log(req.file)
    
//     const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid())
//     console.log(fileUploadResult)

//      const foodItem = await foodModel.create({
//         name: req.body.name,
//         description: req.body.description,
//         video: fileUploadResult.url,
//         foodPartner: req.foodPartner._id
//     })

//     res.status(201).json({
//         message: "food created successfully",
//         food: foodItem
//     })
   
// }

// async function getFoodItems(req, res) {
//     const foodItems = await foodModel.find({})
//     res.status(200).json({
//         message: "Food items fetched successfully",
//         foodItems
//     })
// }


// module.exports = {
//     createFood,
//      getFoodItems
// }

const foodModel = require('../models/food.model');
const commentModel = require('../models/comment.model');
const storageService = require('../services/storage.service');
const likeModel = require("../models/likes.model")
const saveModel = require("../models/save.model")
const { v4: uuid } = require("uuid")


async function createFood(req, res) {
    const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid())

    const foodItem = await foodModel.create({
        name: req.body.name,
        description: req.body.description,
        video: fileUploadResult.url,
        foodPartner: req.foodPartner._id
    })

    res.status(201).json({
        message: "food created successfully",
        food: foodItem
    })

}

async function getFoodItems(req, res) {
    const foodItems = await foodModel.find({})
    const foodIds = foodItems.map((item) => item._id)
    const comments = await commentModel.find({ food: { $in: foodIds } }).sort({ createdAt: 1 }).lean()

    const foodItemsWithComments = foodItems.map((item) => {
        const itemComments = comments
            .filter((comment) => comment.food.toString() === item._id.toString())
            .map((comment) => ({
                id: comment._id,
                userName: comment.userName,
                avatar: comment.avatar,
                text: comment.text,
                createdAt: comment.createdAt,
            }))

        return {
            ...item.toObject(),
            comments: itemComments,
        }
    })

    res.status(200).json({
        message: "Food items fetched successfully",
        foodItems: foodItemsWithComments
    })
}

async function commentFood(req, res) {
    const { foodId, text } = req.body;
    if (!text || !text.trim()) {
        return res.status(400).json({ message: "Comment text is required" });
    }

    const userName = req.user?.fullName || req.user?.name || "Guest";
    const avatar = req.user?.avatar || `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(userName)}`;

    const comment = await commentModel.create({
        user: req.user._id,
        food: foodId,
        userName,
        avatar,
        text: text.trim(),
    });

    const updatedFood = await foodModel.findByIdAndUpdate(
        foodId,
        { $inc: { commentsCount: 1 } },
        { new: true }
    );

    if (!updatedFood) {
        return res.status(404).json({ message: "Food item not found" });
    }

    res.status(201).json({
        message: "Comment added successfully",
        comment: {
            id: comment._id,
            userName: comment.userName,
            avatar: comment.avatar,
            text: comment.text,
            createdAt: comment.createdAt,
        },
        commentsCount: updatedFood.commentsCount,
    });
}


async function likeFood(req, res) {
    const { foodId } = req.body;
    const user = req.user;

    const isAlreadyLiked = await likeModel.findOne({
        user: user._id,
        food: foodId
    })

    if (isAlreadyLiked) {
        await likeModel.deleteOne({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { likeCount: -1 }
        })

        return res.status(200).json({
            message: "Food unliked successfully"
        })
    }

    const like = await likeModel.create({
        user: user._id,
        food: foodId
    })

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { likeCount: 1 }
    })

    res.status(201).json({
        message: "Food liked successfully",
        like
    })

}

async function saveFood(req, res) {

    const { foodId } = req.body;
    const user = req.user;

    const isAlreadySaved = await saveModel.findOne({
        user: user._id,
        food: foodId
    })

    if (isAlreadySaved) {
        await saveModel.deleteOne({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { savesCount: -1 }
        })

        return res.status(200).json({
            message: "Food unsaved successfully"
        })
    }

    const save = await saveModel.create({
        user: user._id,
        food: foodId
    })

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { savesCount: 1 }
    })

    res.status(201).json({
        message: "Food saved successfully",
        save
    })

}

async function getSaveFood(req, res) {

    const user = req.user;

    const savedFoods = await saveModel.find({ user: user._id }).populate('food');

    if (!savedFoods || savedFoods.length === 0) {
        return res.status(404).json({ message: "No saved foods found" });
    }

    res.status(200).json({
        message: "Saved foods retrieved successfully",
        savedFoods
    });

}


module.exports = {
    createFood,
    getFoodItems,
    commentFood,
    likeFood,
    saveFood,
    getSaveFood
}