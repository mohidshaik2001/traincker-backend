import { Schema, model, Document } from "mongoose";
const biometricsSchema = new Schema({
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: true,
    },
    measurements: {
        height: {
            type: Number,
            required: true,
        },
        weight: {
            type: Number,
            required: true,
        },
        waist: {
            type: Number,
            required: true,
        },
        neck: {
            type: Number,
            required: true,
        },
        hips: {
            type: Number,
        },
        thighs: {
            type: Number,
        },
    },
    baseLineCapacity: {
        weights: {
            waterJugRPE: { type: Number },
            estimated1RM: { type: Number },
        },
        cardio: {
            testMetrics: { type: String },
            result: { type: Number },
        },
    },
    currentFatPercentage: {
        type: Number,
    },
    currentTdee: {
        type: Number,
    },
}, { timestamps: true });
export const Biometrics = model("Biometrics", biometricsSchema);
//# sourceMappingURL=biometrics.models.js.map