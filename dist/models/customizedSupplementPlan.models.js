import { model, Schema, Types, Document } from "mongoose";
const customizedSupplementPlanSchema = new Schema({
    schedule: {
        type: Map,
        of: [
            {
                supplementId: {
                    type: Schema.Types.ObjectId,
                    ref: "Supplement",
                    required: true,
                },
                quantity: { type: Number, required: true },
                time: {
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
            },
        ],
    },
}, { timestamps: true });
export const CustomizedSupplementPlan = model("CustomizedSupplementPlan", customizedSupplementPlanSchema);
//# sourceMappingURL=customizedSupplementPlan.models.js.map