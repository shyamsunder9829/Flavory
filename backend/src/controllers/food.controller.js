const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const likeModel = require("../models/likes.model")
const saveModel = require("../models/save.model")
const { v4: uuid } = require("uuid")


async function createFood(req, res) {
    try {
        if (!req.foodPartner) return res.status(401).json({ message: "Please login as food partner" });

        const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid())

        const foodItem = await foodModel.create({
            name: req.body.name,
            description: req.body.description,
            video: fileUploadResult.url,
            foodPartner: req.foodPartner._id
        })

        res.status(201).json({ message: "food created successfully", food: foodItem })
    } catch (err) {
        console.error('createFood error:', err);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getFoodItems(req, res) {
    try {
        const foodItems = await foodModel.find({})
        res.status(200).json({ message: "Food items fetched successfully", foodItems })
    } catch (err) {
        console.error('getFoodItems error:', err);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function likeFood(req, res) {
    try {
        const { foodId } = req.body;
        const user = req.user;

        if (!user) return res.status(401).json({ message: "Please login first" });

        const isAlreadyLiked = await likeModel.findOne({ user: user._id, food: foodId })

        if (isAlreadyLiked) {
            await likeModel.deleteOne({ user: user._id, food: foodId })
            await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: -1 } })
            return res.status(200).json({ message: "Food unliked successfully" })
        }

        const like = await likeModel.create({ user: user._id, food: foodId })
        await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: 1 } })
        res.status(201).json({ message: "Food liked successfully", like })
    } catch (err) {
        console.error('likeFood error:', err);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function saveFood(req, res) {
    try {
        const { foodId } = req.body;
        const user = req.user;

        if (!user) return res.status(401).json({ message: "Please login first" });

        const isAlreadySaved = await saveModel.findOne({ user: user._id, food: foodId })

        if (isAlreadySaved) {
            await saveModel.deleteOne({ user: user._id, food: foodId })
            await foodModel.findByIdAndUpdate(foodId, { $inc: { savesCount: -1 } })
            return res.status(200).json({ message: "Food unsaved successfully" })
        }

        const save = await saveModel.create({ user: user._id, food: foodId })
        await foodModel.findByIdAndUpdate(foodId, { $inc: { savesCount: 1 } })
        res.status(201).json({ message: "Food saved successfully", save })
    } catch (err) {
        console.error('saveFood error:', err);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getSaveFood(req, res) {
    try {
        const user = req.user;
        if (!user) return res.status(401).json({ message: "Please login first" });

        const savedFoods = await saveModel.find({ user: user._id }).populate('food');

        // return an empty array (200) when the user has no saved foods — avoids frontend network 404
        if (!savedFoods || savedFoods.length === 0) {
            return res.status(200).json({ message: "Saved foods retrieved successfully", savedFoods: [] });
        }

        res.status(200).json({ message: "Saved foods retrieved successfully", savedFoods });
    } catch (err) {
        console.error('getSaveFood error:', err);
        res.status(500).json({ message: "Internal server error" });
    }
}


module.exports = {
    createFood,
    getFoodItems,
    likeFood,
    saveFood,
    getSaveFood
}