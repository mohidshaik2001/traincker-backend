import { Document } from "mongoose";
export interface IBiometrics extends Document {
    age: number;
    gender: string;
    measurements: {
        height: number;
        weight: number;
        waist: number;
        neck: number;
        hips?: number;
        thighs?: number;
    };
    baseLineCapacity: {
        weights: {
            waterJugRPE: number;
            estimated1RM: number;
        };
        cardio: {
            testMetrics: string;
            result: number;
        };
    };
    currentFatPercentage?: number;
    currentTdee?: number;
}
export declare const Biometrics: import("mongoose").Model<IBiometrics, {}, {}, {}, Document<unknown, {}, IBiometrics, {}, import("mongoose").DefaultSchemaOptions> & IBiometrics & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IBiometrics>;
//# sourceMappingURL=biometrics.models.d.ts.map