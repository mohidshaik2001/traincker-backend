import { Types, Document, Model } from "mongoose";
export interface IFood extends Document {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
    micros: Types.Map<string>;
    tags: string[];
    baseServingAmount: number;
    baseServingUnit: string;
    servingAmount: number;
    servingUnit: string;
}
interface IFoodModel extends Model<IFood> {
    searchAndFilter(this: Model<IFood>, queryName: string, queryTags?: string[]): Promise<IFood[]>;
}
declare const Food: IFoodModel;
export default Food;
//# sourceMappingURL=food.models.d.ts.map