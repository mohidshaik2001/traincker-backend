import { Document, Types } from "mongoose";
export interface IadhocFood {
    foodId: Types.ObjectId;
    quantity: number;
    macros: {
        protein: number;
        carbs: number;
        fat: number;
    };
}
export interface Idietlog {
    plannedItemsChecked: Types.Map<boolean>;
    adHocFoods: IadhocFood[];
    liveMacroTotal: {
        calories: number;
        macros: {
            protein: number;
            carbs: number;
            fat: number;
        };
    };
}
export interface Iworkout {
    isRestDay: boolean;
    exercisesCompleted: Types.Map<boolean>;
}
export interface IdailyLog extends Document {
    userId: Types.ObjectId;
    dateString: string;
    isFinalized: boolean;
    morningWeight: number;
    dietLog: Idietlog;
    workoutLog: Iworkout;
    supplementLog: Types.Map<boolean>;
}
export declare const DailyLog: import("mongoose").Model<IdailyLog, {}, {}, {}, Document<unknown, {}, IdailyLog, {}, import("mongoose").DefaultSchemaOptions> & IdailyLog & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IdailyLog>;
//# sourceMappingURL=dailyLog.models.d.ts.map