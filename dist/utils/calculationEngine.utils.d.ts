import { type IBiometrics } from "../models/biometrics.models.js";
import type { IDietPreference } from "../models/dietPreference.models.js";
import type { ICustomizedDietPlan } from "../models/customizedDietPlan.models.js";
import type { ICustomizedTrainingPlan } from "../models/customizedTrainingPlan.models.js";
import type { ICustomizedSupplementPlan } from "../models/customizedSupplementPlan.models.js";
interface reverseEngineeredMetrics {
    fatPercentage: number;
    weight: number;
    macros?: {
        calories: number;
        protein: number;
        carbs: number;
        fats: number;
    };
    time?: Date;
}
export interface ITrainingArchitecture {
    splitName: string;
    weightsDays: number;
    cardioDays: number;
    totalDaysPerWeek: number;
    template: string[];
}
interface IPlan {
    dietPlan: ICustomizedDietPlan;
    TrainingPlan: ICustomizedTrainingPlan;
    supplementPlan: ICustomizedSupplementPlan;
    reverseEngineeredMetricsCalculated: reverseEngineeredMetrics;
}
type generatePlan = (biometrics: IBiometrics, dietPreference: IDietPreference, reverseEngineeredMetrics: reverseEngineeredMetrics) => Promise<IPlan | null>;
type processBiometrics = (biometrics: IBiometrics) => Promise<IBiometrics>;
export declare const generatePlan: generatePlan;
export declare const processBiometrics: processBiometrics;
export declare const calculateFatPercentage: (gender: string, weight: number, height: number, neck: number, waist: number, hips?: number) => number;
export declare const calculateTdee: (weight: number, height: number, age: number, gender: string) => number;
export declare const determineTrainingArchitecture: (baseLineCapacity: IBiometrics["baseLineCapacity"]) => ITrainingArchitecture;
export declare const calculateTargetmacros: (biometrics: IBiometrics, targetWeight: number, trainingDays: number) => any;
export declare const determineMealSchedule: (targetCalories: number) => string[];
export declare const buildDietPlan: (targetMacros: any, dietPreference: any) => Promise<ICustomizedDietPlan | null>;
export declare const buildTrainingPlan: (architecture: ITrainingArchitecture) => Promise<any>;
export declare const buildSupplementPlan: (dietPreference: any) => Promise<any>;
export {};
//# sourceMappingURL=calculationEngine.utils.d.ts.map