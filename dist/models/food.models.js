import { Schema, model, Types, Document, Model } from "mongoose";
import { th } from "zod/locales";
import { ApiError } from "../utils/ApiError.utils.js";
const foodSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    calories: {
        type: Number,
        required: true,
    },
    protein: {
        type: Number,
        required: true,
    },
    carbs: {
        type: Number,
        required: true,
    },
    fats: {
        type: Number,
        required: true,
    },
    fiber: {
        type: Number,
        required: true,
    },
    micros: {
        type: Map,
        of: String,
    },
    tags: [
        {
            type: String,
        },
    ],
    baseServingAmount: {
        type: Number,
        required: true,
    },
    baseServingUnit: {
        type: String,
        required: true,
    },
    servingAmount: {
        type: Number,
        required: true,
    },
    servingUnit: {
        type: String,
        required: true,
    },
}, {
    collection: "foods",
});
foodSchema.statics.searchAndFilter = async function (queryName, queryTags) {
    try {
        const findQuery = {};
        if (queryName) {
            findQuery.name = { $regex: queryName, $options: "i" };
        }
        if (queryTags && queryTags.length > 0) {
            findQuery.tags = { $all: queryTags };
        }
        return await this.find(findQuery).exec();
    }
    catch (error) {
        if (error instanceof Error)
            throw new ApiError(500, [], error.message);
        return [];
    }
};
const Food = model("Food", foodSchema);
export default Food;
//# sourceMappingURL=food.models.js.map