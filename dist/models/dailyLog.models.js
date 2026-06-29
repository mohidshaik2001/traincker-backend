import { Schema, model, Document, Types } from "mongoose";
const dailyLogSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    dateString: {
        type: String,
        required: true,
        index: true,
    },
    isFinalized: {
        type: Boolean,
        default: false,
    },
    morningWeight: {
        type: Number,
        required: true,
    },
    dietLog: {
        plannedItemsChecked: {
            type: Map,
            of: Boolean,
            default: {},
        },
        adHocFoods: [
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
                macros: {
                    protein: { type: Number },
                    carbs: { type: Number },
                    fat: { type: Number },
                },
            },
        ],
        liveMacroTotal: {
            calories: { type: Number },
            protein: { type: Number },
            carbs: { type: Number },
            fat: { type: Number },
        },
    },
    workoutLog: {
        isRestDay: {
            type: Boolean,
            default: false,
        },
        exercisesCompleted: {
            type: Map,
            of: Boolean,
            default: {},
        },
    },
    supplementLog: {
        type: Map,
        of: Boolean,
        default: {},
    },
});
export const DailyLog = model("DailyLog", dailyLogSchema);
//# sourceMappingURL=dailyLog.models.js.map