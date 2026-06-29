import { Schema, model, Document, Model } from "mongoose";
import { ApiError } from "../utils/ApiError.utils.js";
const visualGoalSchema = new Schema({
    gender: {
        type: String,
        enum: ["male", "female"],
        required: true,
    },
    heightBin: {
        type: String,
        required: true,
    },
    weightBin: {
        type: String,
        required: true,
    },
    bodyFatBin: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
}, { timestamps: true });
visualGoalSchema.statics.searchAndFilter = async function (queryGender) {
    try {
        const findQuery = {};
        if (queryGender) {
            findQuery.gender = queryGender;
        }
        return await this.find(findQuery).exec();
    }
    catch (error) {
        if (error instanceof Error)
            throw new ApiError(500, [], error.message);
        return [];
    }
};
export const VisualGoal = model("VisualGoal", visualGoalSchema);
//# sourceMappingURL=visualGoal.model.js.map