import { model, Schema, Document, Types, Model } from "mongoose";
import { generatePlan } from "../utils/calculationEngine.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
const CustomizedPlanSchema = new Schema({
    assessmentId: {
        type: Schema.Types.ObjectId,
        ref: "UserAssessment",
        required: true,
    },
    customizedDietPlanId: {
        type: Schema.Types.ObjectId,
        ref: "CustomizedDietPlan",
    },
    customizedTrainingPlanId: {
        type: Schema.Types.ObjectId,
        ref: "CustomizedTrainingPlan",
    },
    customizedSupplementPlanId: {
        type: Schema.Types.ObjectId,
        ref: "CustomizedSupplementPlan",
    },
    calculatedTargets: {
        macros: {
            calories: { type: Number },
            protein: { type: Number },
            carbs: { type: Number },
            fat: { type: Number },
        },
    },
    projectedTimeline: {
        type: Date,
    },
}, { timestamps: true });
CustomizedPlanSchema.statics.buildTargetProtocols = async function (assessmentId, biometricsId, dietPreferenceId, reverseEngineeredMetrics) {
    try {
        const biometrics = await model("Biometrics").findById(biometricsId);
        const dietPreference = await model("DietPreference").findById(dietPreferenceId);
        if (biometrics && dietPreference)
            console.log("biometrics and dietPreference exist");
        if (!biometrics || !dietPreference) {
            throw new ApiError(400, [], "biometrics or dietPreference not found");
            return null;
        }
        const result = await generatePlan(biometrics, dietPreference, reverseEngineeredMetrics);
        console.log(`${result}\n------------\n`);
        if (!result) {
            throw new ApiError(400, [], "error in building customized plan-buildTargetProtocols");
            return null;
        }
        const { dietPlan, TrainingPlan, supplementPlan, reverseEngineeredMetricsCalculated, } = result;
        const newCustomizedPlan = new this({
            assessmentId,
            customizedDietPlanId: dietPlan._id,
            customizedTrainingPlanId: TrainingPlan._id,
            customizedSupplementPlanId: supplementPlan._id,
            calculatedTargets: {
                macros: reverseEngineeredMetricsCalculated.macros,
            },
            projectedTimeline: reverseEngineeredMetricsCalculated.time,
        });
        await newCustomizedPlan.save();
        await model("UserAssessment").findByIdAndUpdate(assessmentId, {
            isAssessmentCompleted: true,
            customizedPlanId: newCustomizedPlan._id,
        });
        return newCustomizedPlan;
    }
    catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        else if (error instanceof Error) {
            throw new ApiError(500, [], error.message);
        }
        return null;
    }
};
const CustomizedPlan = model("CustomizedPlan", CustomizedPlanSchema);
export default CustomizedPlan;
//# sourceMappingURL=customizedPlan.models.js.map