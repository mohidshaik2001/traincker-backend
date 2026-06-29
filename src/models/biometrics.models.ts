import { Schema, model,Document } from "mongoose";

export interface IBiometrics extends Document {
  age: number;
  gender: string;
  measurements: {
    height: number;
    weight: number;
    waist: number;
    neck: number;
    hips?: number;
    thighs?: number;
  };
  baseLineCapacity: {
    weights: {
      waterJugRPE: number;
      estimated1RM: number;
    };
    cardio: {
      testMetrics: string;
      result: number;
    };
  };
  currentFatPercentage?: number;
  currentTdee?: number;
}


const biometricsSchema = new Schema<IBiometrics>(
  {
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
  },
  { timestamps: true },
);

export const Biometrics = model<IBiometrics>("Biometrics", biometricsSchema);
