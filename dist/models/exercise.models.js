import { Schema, model, Document, Model } from "mongoose";
import { ApiError } from "../utils/ApiError.utils.js";
const exerciseSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    targetMuscle: {
        type: String,
        required: true,
    },
    equipment: {
        type: String,
        required: true,
    },
    mechanic: {
        type: String,
        required: true,
    },
    caloriesBurnRate: {
        type: Number,
        required: true,
    },
});
exerciseSchema.statics.searchAndFilterExercises = async function (queryType, queryTargetMuscle) {
    try {
        const findQuery = {};
        if (queryType) {
            findQuery.type = queryType;
        }
        if (queryTargetMuscle) {
            findQuery.targetMuscle = queryTargetMuscle;
        }
        return await this.find(findQuery).exec();
    }
    catch (error) {
        if (error instanceof Error)
            throw new ApiError(500, [], error.message);
        return [];
    }
};
export const Exercise = model("Exercise", exerciseSchema);
export default Exercise;
//# sourceMappingURL=exercise.models.js.map