import { Document, Model } from "mongoose";
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
export declare const VisualGoal: IVisualGoalModel;
export {};
//# sourceMappingURL=visualGoal.model.d.ts.map