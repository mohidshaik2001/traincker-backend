import CustomizedPlan from "../models/customizedPlan.models.js";
import { CustomizedDietPlan } from "../models/customizedDietPlan.models.js";
import { CustomizedTrainingPlan } from "../models/customizedTrainingPlan.models.js";
import { CustomizedSupplementPlan } from "../models/customizedSupplementPlan.models.js";
import Food from "../models/food.models.js";
import Exercise from "../models/exercise.models.js";
import Supplement from "../models/supplement.models.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
export const getCustomizedPlan = asyncHandler(async function (req, res) {
    try {
        const { customizedPlanId } = req.body;
        const customizedPlan = await CustomizedPlan.findById(customizedPlanId);
        if (!customizedPlan) {
            throw new ApiError(400, [], "customized plan not found");
        }
        const { customizedDietPlanId, customizedTrainingPlanId, customizedSupplementPlanId, calculatedTargets, } = customizedPlan;
        const [dietPlan, trainingPlan, supplementPlan] = await Promise.all([
            CustomizedDietPlan.findById(customizedDietPlanId).populate("meals.$*.foodId", "name calories protein carbs fats servingAmount servingUnit"),
            CustomizedTrainingPlan.findById(customizedTrainingPlanId).populate("schedule.$*.exerciseId", "name targetMuscle mechanic"),
            CustomizedSupplementPlan.findById(customizedSupplementPlanId).populate("schedule.$*.supplementId", "name"),
        ]);
        if (!dietPlan || !trainingPlan || !supplementPlan) {
            throw new ApiError(400, [], "customized plan not found");
        }
        res
            .status(200)
            .json(new ApiResponse(200, { dietPlan, trainingPlan, supplementPlan, calculatedTargets }, "customized plan found"));
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
//# sourceMappingURL=customizedPlan.controllers.js.map