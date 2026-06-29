import { Schema, model, Document, Types, Model } from "mongoose";

import { Biometrics } from "./biometrics.models.js";
import { DietPreference } from "./dietPreference.models.js";

import type { IBiometrics } from "./biometrics.models.js";
import type { IDietPreference } from "./dietPreference.models.js";
import { ApiError } from "../utils/ApiError.utils.js";
export interface IUserAssessment extends Document {
  userId: Types.ObjectId;
  biometricsId: Types.ObjectId;
  dietPreferenceId: Types.ObjectId;
  customizedPlanId?: Types.ObjectId;
  isAssessmentCompleted: boolean;
}

interface IUserAssessmentModel extends Model<IUserAssessment> {
  assembleAssessmentData(
    this: IUserAssessmentModel,
    userId: string,
    processedBiometrics: IBiometrics,
    rawPreferences: any,
  ): Promise<IUserAssessment | null>;
}

const userAssessmentSchema = new Schema<IUserAssessment, IUserAssessmentModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    biometricsId: {
      type: Schema.Types.ObjectId,
      ref: "Biometrics",
    },
    dietPreferenceId: {
      type: Schema.Types.ObjectId,
      ref: "DietPreference",
    },
    customizedPlanId: {
      type: Schema.Types.ObjectId,
      ref: "CustomizedPlan",
    },
    isAssessmentCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userAssessmentSchema.statics.assembleAssessmentData = async function (
  this: IUserAssessmentModel,
  userId: string,
  processedBiometrics: IBiometrics,
  rawPreferences: any,
): Promise<IUserAssessment | null> {
  try {
    const newBiometrics = new Biometrics(processedBiometrics);
    console.log(newBiometrics);
    await newBiometrics.save();

    const newDietPreference = new DietPreference(rawPreferences);
    console.log("newDietPreference", newDietPreference);
    await newDietPreference.save();

    const newUserAssessment = new this({
      userId,
      biometricsId: newBiometrics._id,
      dietPreferenceId: newDietPreference._id,
      isAssessmentCompleted: false,
    });

    await newUserAssessment.save();
    return newUserAssessment;
  } catch (error) {
    if (error instanceof Error) throw new ApiError(500, [], error.message);
    return null;
  }
};

userAssessmentSchema.statics.findBio;

const UserAssessment = model<IUserAssessment, IUserAssessmentModel>(
  "UserAssessment",
  userAssessmentSchema,
);
export default UserAssessment;
