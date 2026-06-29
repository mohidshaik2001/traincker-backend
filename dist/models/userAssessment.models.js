import { Schema, model, Document, Types, Model } from "mongoose";
import { Biometrics } from "./biometrics.models.js";
import { DietPreference } from "./dietPreference.models.js";
import { ApiError } from "../utils/ApiError.utils.js";
const userAssessmentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    biometricsId: {
        type: Schema.Types.ObjectId,
        ref: "Biometrics",
    },
    dietPreferenceId: {
        type: Schema.Types.ObjectId,
        ref: "DietPreference",
    },
    customizedPlanId: {
        type: Schema.Types.ObjectId,
        ref: "CustomizedPlan",
    },
    isAssessmentCompleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
userAssessmentSchema.statics.assembleAssessmentData = async function (userId, processedBiometrics, rawPreferences) {
    try {
        const newBiometrics = new Biometrics(processedBiometrics);
        console.log(newBiometrics);
        await newBiometrics.save();
        const newDietPreference = new DietPreference(rawPreferences);
        console.log("newDietPreference", newDietPreference);
        await newDietPreference.save();
        const newUserAssessment = new this({
            userId,
            biometricsId: newBiometrics._id,
            dietPreferenceId: newDietPreference._id,
            isAssessmentCompleted: false,
        });
        await newUserAssessment.save();
        return newUserAssessment;
    }
    catch (error) {
        if (error instanceof Error)
            throw new ApiError(500, [], error.message);
        return null;
    }
};
userAssessmentSchema.statics.findBio;
const UserAssessment = model("UserAssessment", userAssessmentSchema);
export default UserAssessment;
//# sourceMappingURL=userAssessment.models.js.map