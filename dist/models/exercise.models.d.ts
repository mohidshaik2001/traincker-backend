import { Document, Model } from "mongoose";
export interface IExercise extends Document {
    name: string;
    type: string;
    targetMuscle: string;
    equipment: string;
    mechanic: string;
    caloriesBurnRate: number;
}
interface IExerciseModel extends Model<IExercise> {
    searchAndFilterExercises(this: IExerciseModel, queryType?: string, queryTargetMuscle?: string): Promise<IExercise[]>;
}
export declare const Exercise: IExerciseModel;
export default Exercise;
//# sourceMappingURL=exercise.models.d.ts.map