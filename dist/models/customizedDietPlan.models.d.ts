import { Document, Types } from "mongoose";
export interface ICustomizedDietPlan extends Document {
    targetMealsPerDay: number;
    meals: Types.Map<{
        foodId: Types.ObjectId;
        quantity: number;
    }[]>;
}
export declare const CustomizedDietPlan: import("mongoose").Model<ICustomizedDietPlan, {}, {}, {}, Document<unknown, {}, ICustomizedDietPlan, {}, import("mongoose").DefaultSchemaOptions> & ICustomizedDietPlan & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ICustomizedDietPlan>;
//# sourceMappingURL=customizedDietPlan.models.d.ts.map