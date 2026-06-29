import { model, Schema, Document, Types } from "mongoose";
const customizedDietPlanSchema = new Schema({
    targetMealsPerDay: {
        type: Number,
        required: true,
    },
    meals: {
        type: Map,
        of: [
            {
                foodId: {
                    type: Schema.Types.ObjectId,
                    ref: "Food",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
            },
        ],
    },
}, { timestamps: true });
export const CustomizedDietPlan = model("CustomizedDietPlan", customizedDietPlanSchema);
//# sourceMappingURL=customizedDietPlan.models.js.map