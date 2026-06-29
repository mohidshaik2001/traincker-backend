import { Schema, model, Document, Model } from "mongoose";
import { ApiError } from "../utils/ApiError.utils.js";

export interface IExercise extends Document {
  name: string;
  type: string;
  targetMuscle: string;
  equipment: string;
  mechanic: string;
  caloriesBurnRate: number;
}

interface IExerciseModel extends Model<IExercise> {
  searchAndFilterExercises(
    this: IExerciseModel,
    queryType?: string,
    queryTargetMuscle?: string,
  ): Promise<IExercise[]>;
}

const exerciseSchema = new Schema<IExercise, IExerciseModel>({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  targetMuscle: {
    type: String,
    required: true,
  },
  equipment: {
    type: String,
    required: true,
  },
  mechanic: {
    type: String,
    required: true,
  },
  caloriesBurnRate: {
    type: Number,
    required: true,
  },
});

exerciseSchema.statics.searchAndFilterExercises = async function (
  this: IExerciseModel,
  queryType?: string,
  queryTargetMuscle?: string,
): Promise<IExercise[]> {
  try {
    const findQuery: any = {};
    if (queryType) {
      findQuery.type = queryType;
    }
    if (queryTargetMuscle) {
      findQuery.targetMuscle = queryTargetMuscle;
    }
    return await this.find(findQuery).exec();
  } catch (error) {
    if (error instanceof Error) throw new ApiError(500, [], error.message);
    return [];
  }
};

export const Exercise = model<IExercise, IExerciseModel>(
  "Exercise",
  exerciseSchema,
);

export default Exercise;
