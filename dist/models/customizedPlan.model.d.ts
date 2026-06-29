import { Schema, Document, Types, Model } from "mongoose";
export interface ICustomizedPlan extends Document {
    assessmentId: Schema.Types.ObjectId;
    customizedDietPlanId: Schema.Types.ObjectId;
    customizedTrainingPlanId: Schema.Types.ObjectId;
    customizedSupplementPlanId: Schema.Types.ObjectId;
    calculatedTargets: {
        calories: number;
        macros: {
            protein: number;
            carbs: number;
            fat: number;
        };
    };
    projectedTimeline: Date;
}
interface ICustomizedPlanModel extends Model<ICustomizedPlan> {
    buildTargetProtocols(this: ICustomizedPlanModel, assessmentId: Types.ObjectId, biometricsId: Types.ObjectId, dietPreferenceId: Types.ObjectId, reverseEngineeredMetrics: any): Promise<ICustomizedPlan | null>;
}
export declare const CustomizedPlan: ICustomizedPlanModel;
export {};
//# sourceMappingURL=customizedPlan.model.d.ts.map