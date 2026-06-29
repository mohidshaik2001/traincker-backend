import { Schema, model, Document, Types } from "mongoose";
const dietPreferenceSchema = new Schema({
    acceptedFoods: [
        {
            foodId: {
                type: Schema.Types.ObjectId,
                ref: "Foods",
                required: true,
            },
        },
    ],
    allergies: [{ type: String }],
}, { timestamps: true });
export const DietPreference = model("DietPreference", dietPreferenceSchema);
//# sourceMappingURL=dietPreference.models.js.map