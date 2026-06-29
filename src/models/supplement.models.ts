import { Schema, model, Document, Model } from "mongoose";
import { ApiError } from "../utils/ApiError.utils.js";

export type optimalTiming =
  | "before-breakfast"
  | "after-breakfast"
  | "before-lunch"
  | "after-lunch"
  | "before-dinner"
  | "after-dinner"
  | "pre-workout"
  | "post-workout"
  | "before-sleep";

export interface ISupplement extends Document {
  name: string;
  category: string;
  standardDosage: string;
  optimalTiming: optimalTiming;
}

interface ISupplementModel extends Model<ISupplement> {
  searchAndFilter(
    this: ISupplementModel,
    queryName?: string,
    queryCategory?: string,
    queryTiming?: string,
  ): Promise<ISupplement[]>;
}

const supplementSchema = new Schema<ISupplement, ISupplementModel>({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  standardDosage: {
    type: String,
    required: true,
  },
  optimalTiming: {
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
});

supplementSchema.statics.searchAndFilter = async function (
  this: ISupplementModel,
  queryName?: string,
  queryCategory?: string,
  queryTiming?: string,
): Promise<ISupplement[]> {
  try {
    const findQuery: any = {};
    if (queryName) findQuery.name = { $regex: queryName, $options: "i" };
    if (queryCategory) findQuery.category = queryCategory;
    if (queryTiming) findQuery.timing = queryTiming;

    return await this.find(findQuery).exec();
  } catch (error) {
    if (error instanceof Error) throw new ApiError(500, [], error.message);

    return [];
  }
};

export const Supplement = model<ISupplement, ISupplementModel>(
  "Supplement",
  supplementSchema,
);

export default Supplement;
