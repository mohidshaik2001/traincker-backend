import { asyncHandler } from "../utils/asyncHandler.utils.js";
import User from "../models/user.models.js";
import UserAssessment from "../models/userAssessment.models.js";
import CustomizedPlan from "../models/customizedPlan.models.js";
import { Biometrics } from "../models/biometrics.models.js";
import { DietPreference } from "../models/dietPreference.models.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { CustomizedDietPlan } from "../models/customizedDietPlan.models.js";
import { CustomizedTrainingPlan } from "../models/customizedTrainingPlan.models.js";
import { CustomizedSupplementPlan } from "../models/customizedSupplementPlan.models.js";
export const registerUser = asyncHandler(async function (req, res) {
    try {
        const { fullName, email, password } = req.body;
        if ([fullName, email, password].some((field) => {
            return field?.trim() === "";
        })) {
            throw new ApiError(400, [], "All fields are required");
        }
        const existedUser = await User.findOne({ email });
        if (existedUser) {
            throw new ApiError(400, [], "User already exists");
        }
        const user = await User.createUser({ fullName, email, password });
        const safeUser = await User.findById(user._id).select("-password");
        res
            .status(201)
            .json(new ApiResponse(201, safeUser, "User created successfully"));
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
export const loginUser = asyncHandler(async function (req, res) {
    try {
        const { email, password } = req.body;
        if ([email, password].some((field) => {
            return field?.trim() === "";
        })) {
            throw new ApiError(400, [], "All fields are required");
        }
        const user = (await User.findOne({
            email,
        }));
        if (!user) {
            throw new ApiError(401, [], "Invalid credentials - email");
        }
        const isPasswordMatched = await user.isPasswordMatch(password);
        if (!isPasswordMatched) {
            throw new ApiError(401, [], "Invalid credentials - password ");
        }
        const safeUser = await User.findById(user._id).select("-password");
        const accessToken = user.generateAccessTokens();
        const options = {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        };
        res
            .cookie("accessToken", accessToken, options)
            .status(200)
            .json(new ApiResponse(200, safeUser, "Login successful"));
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
export const logoutUser = asyncHandler(async function (req, res) {
    try {
        const user = req.user;
        res
            .clearCookie("accessToken")
            .status(200)
            .json(new ApiResponse(200, {}, "Logout successful"));
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
export const currentUser = asyncHandler(async function (req, res) {
    try {
        const user = req.user;
        res.status(200).json(new ApiResponse(200, user, "User found successfully"));
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
export const getInitialData = asyncHandler(async function (req, res) {
    try {
        const { userId } = req.body;
        if (!userId) {
            throw new ApiError(401, [], "Unauthorized");
        }
        const dataObject = {};
        const userAssessment = await UserAssessment.findOne({ userId: userId });
        console.log("\n-------------\n userAssessment", userAssessment);
        if (userAssessment) {
            dataObject["userAssessment"] = userAssessment;
            if (userAssessment.biometricsId) {
                dataObject["biometrics"] = await Biometrics.findById(userAssessment.biometricsId);
                console.log("\n-------------\n biometrics", dataObject["biometrics"]);
            }
            if (userAssessment.dietPreferenceId) {
                dataObject["dietPreferences"] = await DietPreference.findById(userAssessment.dietPreferenceId);
                console.log("\n-------------\n dietPreferences", dataObject["dietPreferences"]);
            }
            if (userAssessment.isAssessmentCompleted &&
                userAssessment.customizedPlanId) {
                const customizedPlan = await CustomizedPlan.findById(userAssessment.customizedPlanId);
                console.log("\n-------------\n customizedPlan", customizedPlan);
                if (customizedPlan) {
                    const [dietPlan, trainingPlan, supplementPlan] = await Promise.all([
                        CustomizedDietPlan.findById(customizedPlan.customizedDietPlanId).populate("meals.$*.foodId", "name calories protein carbs fats servingAmount servingUnit"),
                        CustomizedTrainingPlan.findById(customizedPlan.customizedTrainingPlanId).populate("schedule.$*.exerciseId", "name targetMuscle mechanic"),
                        CustomizedSupplementPlan.findById(customizedPlan.customizedSupplementPlanId).populate("schedule.$*.supplementId", "name"),
                    ]);
                    dataObject["populatedCustomizedPlan"] = {
                        dietPlan,
                        trainingPlan,
                        supplementPlan,
                        calculatedTargets: customizedPlan.calculatedTargets,
                    };
                }
            }
        }
        res
            .status(200)
            .json(new ApiResponse(200, dataObject, "Initial data found successfully"));
    }
    catch (error) { }
});
//# sourceMappingURL=user.controllers.js.map