import { count } from "node:console";
import mongoose from "mongoose";
import Food from "../models/food.models.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
export const getRandomFoods = asyncHandler(async function (req, res) {
    try {
        const { tag } = req.query;
        if (!tag)
            throw new ApiError(400, [], "tag is required");
        const matchStage = tag ? { tags: tag } : {};
        // --- DIAGNOSTIC TEST START ---
        // console.log("1. Mongoose Connection State:", mongoose.connection.readyState);
        // // 1 means connected, 0 means disconnected
        // console.log("2. Connected Database Name:", mongoose.connection.name);
        // // If this says "test" instead of "traincker", we found the bug!
        // 3. Bypass the Schema entirely and ask the raw MongoDB driver
        // const rawData = await mongoose.connection.db?.collection("foods").find({}).limit(2).toArray();
        // console.log("3. Raw Driver Data Found:", rawData?.length, "records");
        // // --- DIAGNOSTIC TEST END ---
        const randomFoods = await Food.aggregate([
            { $match: matchStage },
            { $sample: { size: 5 } },
        ]);
        res.status(200).json(new ApiResponse(200, randomFoods));
    }
    catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        else if (error instanceof Error) {
            throw new ApiError(500, [], error.message);
        }
        else {
            throw new ApiError(500, [], "An unknown error occurred");
        }
    }
});
export const getAllFoods = asyncHandler(async function (req, res) {
    try {
        const allFoods = await Food.find();
        res.status(200).json(new ApiResponse(200, allFoods));
    }
    catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        else if (error instanceof Error) {
            throw new ApiError(500, [], error.message);
        }
        else {
            throw new ApiError(500, [], "An unknown error occurred");
        }
    }
});
//# sourceMappingURL=food.controllers.js.map