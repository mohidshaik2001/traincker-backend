import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { Biometrics } from "../models/biometrics.models.js";
import { DietPreference, } from "../models/dietPreference.models.js";
import { generatePlan, processBiometrics, } from "../utils/calculationEngine.utils.js";
import UserAssessment from "../models/userAssessment.models.js";
import CustomizedPlan from "../models/customizedPlan.models.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
export const setUserAssessment = asyncHandler(async function (req, res) {
    try {
        const { userId, biometrics, dietPreferences } = req.body;
        const userAssessment = await UserAssessment.findOne({ userId });
        if (userAssessment) {
            const biometricData = await processBiometrics(biometrics);
            await Biometrics.findByIdAndUpdate(userAssessment.biometricsId, biometricData, {
                new: true,
            });
            await DietPreference.findByIdAndUpdate(userAssessment.dietPreferenceId, dietPreferences, {
                new: true,
            });
            res
                .status(200)
                .json(new ApiResponse(200, { userAssessment: userAssessment, biometrics: biometricData }, "assessment updated successfully"));
            return;
        }
        const biometricData = await processBiometrics(biometrics);
        const result = await UserAssessment.assembleAssessmentData(userId, biometricData, dietPreferences);
        const final_response = {
            userAssessment: result,
            biometrics: biometricData,
        };
        res
            .status(201)
            .json(new ApiResponse(201, final_response, "assessment created successfully"));
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
export const buildCustomizedPlan = asyncHandler(async function (req, res) {
    try {
        const { assessmentId, biometricsId, dietPreferenceId, reverseEngineeredMetrics, } = req.body;
        const userAssessment = await UserAssessment.findById(assessmentId);
        if (!userAssessment) {
            throw new ApiError(400, [], "userAssessment not found");
        }
        if (userAssessment.customizedPlanId) {
            await CustomizedPlan.findByIdAndDelete(userAssessment.customizedPlanId);
        }
        if (userAssessment.isAssessmentCompleted) {
            userAssessment.isAssessmentCompleted = false;
            userAssessment.customizedPlanId = undefined;
            await userAssessment.save();
        }
        const customizedPlan = await CustomizedPlan.buildTargetProtocols(assessmentId, biometricsId, dietPreferenceId, reverseEngineeredMetrics);
        if (!customizedPlan) {
            throw new ApiError(400, [], "building customized Plan failed");
        }
        res
            .status(200)
            .json(new ApiResponse(200, customizedPlan, "plan built successfully"));
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
export const getUserAssessment = asyncHandler(async function (req, res) {
    try {
        const { userId } = req.body;
        const assessment = await UserAssessment.findOne({ userId });
        if (!assessment) {
            throw new ApiError(400, [], "assessment not found");
        }
        res
            .status(200)
            .json(new ApiResponse(200, assessment, "assessment found successfully"));
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
//# sourceMappingURL=userAssessment.controllers.js.map