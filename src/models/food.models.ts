import { Schema, model, Types, Document, Model } from "mongoose";
import { th } from "zod/locales";
import { ApiError } from "../utils/ApiError.utils.js";

export interface IFood extends Document {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  micros: Types.Map<string>;
  tags: string[];
  baseServingAmount: number;
  baseServingUnit: string;
  servingAmount: number;
  servingUnit: string;
}

interface IFoodModel extends Model<IFood> {
  searchAndFilter(
    this: Model<IFood>,
    queryName: string,
    queryTags?: string[],
  ): Promise<IFood[]>;
}

const foodSchema = new Schema<IFood, IFoodModel>(
  {
    name: {
      type: String,
      required: true,
    },
    calories: {
      type: Number,
      required: true,
    },
    protein: {
      type: Number,
      required: true,
    },
    carbs: {
      type: Number,
      required: true,
    },
    fats: {
      type: Number,
      required: true,
    },
    fiber: {
      type: Number,
      required: true,
    },
    micros: {
      type: Map,
      of: String,
    },
    tags: [
      {
        type: String,
      },
    ],
    baseServingAmount: {
      type: Number,
      required: true,
    },
    baseServingUnit: {
      type: String,
      required: true,
    },
    servingAmount: {
      type: Number,
      required: true,
    },
    servingUnit: {
      type: String,
      required: true,
    },
  },
  {
    collection: "foods",
  },
);

foodSchema.statics.searchAndFilter = async function (
  this: IFoodModel,
  queryName: string,
  queryTags?: string[],
): Promise<IFood[]> {
  try {
    const findQuery: any = {};
    if (queryName) {
      findQuery.name = { $regex: queryName, $options: "i" };
    }
    if (queryTags && queryTags.length > 0) {
      findQuery.tags = { $all: queryTags };
    }

    return await this.find(findQuery).exec();
  } catch (error) {
    if (error instanceof Error) throw new ApiError(500, [], error.message);
    return [];
  }
};

const Food = model<IFood, IFoodModel>("Food", foodSchema);
export default Food;
