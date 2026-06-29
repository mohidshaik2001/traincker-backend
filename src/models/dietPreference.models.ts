import { Schema, model,Document, Types } from "mongoose";


type acceptedFood = {
  foodId: Types.ObjectId;
}
export interface IDietPreference extends Document {
  acceptedFoods: acceptedFood[];
  allergies: string[];
  
}

const dietPreferenceSchema = new Schema<IDietPreference>(
  {
    acceptedFoods: [
      {
        foodId: {
          type: Schema.Types.ObjectId,
          ref: "Foods",
          required: true,
        },
      },
    ],
    allergies: [{ type: String }],
  },
  { timestamps: true },
);

export const DietPreference = model<IDietPreference>("DietPreference", dietPreferenceSchema);
