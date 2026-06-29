import { Document, Types } from "mongoose";
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
export declare const CustomizedTrainingPlan: import("mongoose").Model<ICustomizedTrainingPlan, {}, {}, {}, Document<unknown, {}, ICustomizedTrainingPlan, {}, import("mongoose").DefaultSchemaOptions> & ICustomizedTrainingPlan & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ICustomizedTrainingPlan>;
//# sourceMappingURL=customizedTrainingPlan.models.d.ts.map