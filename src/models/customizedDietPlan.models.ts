import { model, Schema, Document, Types } from "mongoose";

export interface ICustomizedDietPlan extends Document {
  targetMealsPerDay: number;
  meals: Types.Map<{ foodId: Types.ObjectId; quantity: number }[]>;
}

const customizedDietPlanSchema = new Schema<ICustomizedDietPlan>(
  {
    targetMealsPerDay: {
      type: Number,
      required: true,
    },
    meals: {
      type: Map,
      of: [
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
        },
      ],
    },
  },
  { timestamps: true },
);

export const CustomizedDietPlan = model<ICustomizedDietPlan>(
  "CustomizedDietPlan",
  customizedDietPlanSchema,
);
