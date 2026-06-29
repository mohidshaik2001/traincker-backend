import { Schema, model, Document, Types } from "mongoose";
const customizedTrainingPlanSchema = new Schema({
    splitName: {
        type: String,
        required: true,
    },
    trainingDaysPerWeek: {
        type: Number,
        required: true,
    },
    schedule: {
        type: Map,
        of: [
            {
                exerciseId: {
                    type: Schema.Types.ObjectId,
                    ref: "Exercise",
                    required: true,
                },
                sets: {
                    type: Number,
                    required: true,
                },
                reps: {
                    type: Number,
                    required: true,
                },
            },
        ],
    },
}, { timestamps: true });
export const CustomizedTrainingPlan = model("CustomizedTrainingPlan", customizedTrainingPlanSchema);
//# sourceMappingURL=customizedTrainingPlan.models.js.map