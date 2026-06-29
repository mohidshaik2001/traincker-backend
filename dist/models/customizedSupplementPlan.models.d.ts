import { Types, Document } from "mongoose";
export type timing = "before-breakfast" | "after-breakfast" | "before-lunch" | "after-lunch" | "before-dinner" | "after-dinner" | "pre-workout" | "post-workout" | "before-sleep";
export interface Supplement {
    supplementId: Types.ObjectId;
    quantity: number;
    time: timing;
}
export interface ICustomizedSupplementPlan extends Document {
    schedule: Types.Map<Supplement[]>;
}
export declare const CustomizedSupplementPlan: import("mongoose").Model<ICustomizedSupplementPlan, {}, {}, {}, Document<unknown, {}, ICustomizedSupplementPlan, {}, import("mongoose").DefaultSchemaOptions> & ICustomizedSupplementPlan & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ICustomizedSupplementPlan>;
//# sourceMappingURL=customizedSupplementPlan.models.d.ts.map