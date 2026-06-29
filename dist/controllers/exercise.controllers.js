import { asyncHandler } from "../utils/asyncHandler.utils.js";
import Exercise from "../models/exercise.models.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
export const getRandomExercises = asyncHandler(async function (req, res) {
    try {
        const { targetMuscle } = req.query;
        if (!targetMuscle)
            throw new ApiError(400, [], "targetMuscle is required");
        const matchStage = targetMuscle
            ? { targetMuscle: targetMuscle }
            : {};
        const randomExercises = await Exercise.aggregate([
            { $match: matchStage },
            { $sample: { size: 5 } },
        ]);
        res.status(200).json(new ApiResponse(200, randomExercises));
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
//# sourceMappingURL=exercise.controllers.js.map