import { Schema, model, Document, Model } from "mongoose";
import { ApiError } from "../utils/ApiError.utils.js";

export type gender = "male" | "female";

export interface IVisualGoal extends Document {
  gender: gender;
  heightBin: string;
  weightBin: string;
  bodyFatBin: string;
  imageUrl: string;
}

interface IVisualGoalModel extends Model<IVisualGoal> {
  searchAndFilter(queryGender: string): Promise<IVisualGoal[]>;
}

const visualGoalSchema = new Schema<IVisualGoal, IVisualGoalModel>(
  {
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    heightBin: {
      type: String,
      required: true,
    },
    weightBin: {
      type: String,
      required: true,
    },
    bodyFatBin: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

visualGoalSchema.statics.searchAndFilter = async function (
  this: IVisualGoalModel,
  queryGender: string,
): Promise<IVisualGoal[]> {
  try {
    const findQuery: any = {};

    if (queryGender) {
      findQuery.gender = queryGender;
    }

    return await this.find(findQuery).exec();
  } catch (error) {
    if (error instanceof Error) throw new ApiError(500, [], error.message);
    return [];
  }
};

export const VisualGoal = model<IVisualGoal, IVisualGoalModel>(
  "VisualGoal",
  visualGoalSchema,
);
