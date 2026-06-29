import { Schema, model, Document, Model } from "mongoose";
import { ApiError } from "../utils/ApiError.utils.js";
const supplementSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    standardDosage: {
        type: String,
        required: true,
    },
    optimalTiming: {
        type: String,
        enum: [
            "before-breakfast",
            "after-breakfast",
            "before-lunch",
            "after-lunch",
            "before-dinner",
            "after-dinner",
            "pre-workout",
            "post-workout",
            "before-sleep",
        ],
        required: true,
    },
});
supplementSchema.statics.searchAndFilter = async function (queryName, queryCategory, queryTiming) {
    try {
        const findQuery = {};
        if (queryName)
            findQuery.name = { $regex: queryName, $options: "i" };
        if (queryCategory)
            findQuery.category = queryCategory;
        if (queryTiming)
            findQuery.timing = queryTiming;
        return await this.find(findQuery).exec();
    }
    catch (error) {
        if (error instanceof Error)
            throw new ApiError(500, [], error.message);
        return [];
    }
};
export const Supplement = model("Supplement", supplementSchema);
export default Supplement;
//# sourceMappingURL=supplement.models.js.map