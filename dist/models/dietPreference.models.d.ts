import { Document, Types } from "mongoose";
type acceptedFood = {
    foodId: Types.ObjectId;
};
export interface IDietPreference extends Document {
    acceptedFoods: acceptedFood[];
    allergies: string[];
}
export declare const DietPreference: import("mongoose").Model<IDietPreference, {}, {}, {}, Document<unknown, {}, IDietPreference, {}, import("mongoose").DefaultSchemaOptions> & IDietPreference & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IDietPreference>;
export {};
//# sourceMappingURL=dietPreference.models.d.ts.map