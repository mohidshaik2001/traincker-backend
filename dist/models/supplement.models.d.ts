import { Document, Model } from "mongoose";
export type optimalTiming = "before-breakfast" | "after-breakfast" | "before-lunch" | "after-lunch" | "before-dinner" | "after-dinner" | "pre-workout" | "post-workout" | "before-sleep";
export interface ISupplement extends Document {
    name: string;
    category: string;
    standardDosage: string;
    optimalTiming: optimalTiming;
}
interface ISupplementModel extends Model<ISupplement> {
    searchAndFilter(this: ISupplementModel, queryName?: string, queryCategory?: string, queryTiming?: string): Promise<ISupplement[]>;
}
export declare const Supplement: ISupplementModel;
export default Supplement;
//# sourceMappingURL=supplement.models.d.ts.map