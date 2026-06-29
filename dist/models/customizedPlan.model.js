import { model, Schema, Document, Types, Model } from "mongoose";
import { generatePlan } from "../utils/calculationEngine.js";
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
        calories: { type: Number },
        macros: {
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
        if (!biometrics || !dietPreference)
            return null;
        const result = await generatePlan(biometrics, dietPreference, reverseEngineeredMetrics);
        if (!result)
            return null;
        const { dietPlan, TrainingPlan, supplementPlan } = result;
        const newCustomizedPlan = new this({
            assessmentId,
            customizedDietPlanId: dietPlan._id,
            customizedTrainingPlanId: TrainingPlan._id,
            customizedSupplementPlanId: supplementPlan._id,
            calculatedTargets: TrainingPlan.calculatedTargets,
            projectedTimeline: TrainingPlan.projectedTimeline
        });
        await newCustomizedPlan.save();
        await model("UserAssessment").findByIdAndUpdate(assessmentId, { isAssessmentCompleted: true, customizedPlanId: newCustomizedPlan._id });
        return newCustomizedPlan;
    }
    catch (error) {
        return null;
    }
};
export const CustomizedPlan = model("CustomizedPlan", CustomizedPlanSchema);
//# sourceMappingURL=customizedPlan.model.js.map