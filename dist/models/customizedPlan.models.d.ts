import { Schema, Document, Types, Model } from "mongoose";
import type { ICustomizedDietPlan } from "./customizedDietPlan.models.js";
import type { ICustomizedTrainingPlan } from "./customizedTrainingPlan.models.js";
import type { ICustomizedSupplementPlan } from "./customizedSupplementPlan.models.js";
export interface ICustomizedPlan extends Document {
    assessmentId: Schema.Types.ObjectId;
    customizedDietPlanId: Schema.Types.ObjectId;
    customizedTrainingPlanId: Schema.Types.ObjectId;
    customizedSupplementPlanId: Schema.Types.ObjectId;
    calculatedTargets: {
        macros: {
            calories: number;
            protein: number;
            carbs: number;
            fats: number;
        };
    };
    projectedTimeline: Date;
}
interface ICustomizedPlanModel extends Model<ICustomizedPlan> {
    buildTargetProtocols(this: ICustomizedPlanModel, assessmentId: Types.ObjectId, biometricsId: Types.ObjectId, dietPreferenceId: Types.ObjectId, reverseEngineeredMetrics: {
        fatPercentage: number;
        weight: number;
        macros?: {
            calories: number;
            protein: number;
            carbs: number;
            fats: number;
        };
        time?: Date;
    }): Promise<ICustomizedPlan | null>;
}
declare const CustomizedPlan: ICustomizedPlanModel;
export default CustomizedPlan;
export interface IPopulatedCustomizedPlan {
    dietPlan: ICustomizedDietPlan | null;
    trainingPlan: ICustomizedTrainingPlan | null;
    supplementPlan: ICustomizedSupplementPlan | null;
    calculatedTargets: {
        macros: {
            calories: number;
            protein: number;
            carbs: number;
            fats: number;
        };
    } | null;
}
//# sourceMappingURL=customizedPlan.models.d.ts.map