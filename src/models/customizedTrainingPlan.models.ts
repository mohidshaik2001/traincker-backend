import { Schema, model,Document,Types } from "mongoose";

export interface ITrainingExercise {
  exerciseId: Types.ObjectId;
  sets: number;
  reps: number;
}
export interface ICustomizedTrainingPlan extends Document {
  splitName: string;
  trainingDaysPerWeek: number;
  schedule: Types.Map<ITrainingExercise[]>;
  
}

const customizedTrainingPlanSchema = new Schema<ICustomizedTrainingPlan>(
  {
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
  },
  { timestamps: true },
);

export const CustomizedTrainingPlan = model<ICustomizedTrainingPlan>(
  "CustomizedTrainingPlan",
  customizedTrainingPlanSchema,
);
