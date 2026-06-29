import type { IBiometrics } from "../models/biometrics.models.js";
import type { IDietPreference } from "../models/dietPreference.models.js";
export declare const generatePlan: (biometrics: IBiometrics, dietPreference: IDietPreference, reverseEngineeredMetrics: any) => Promise<{
    dietPlan: any;
    TrainingPlan: any;
    supplementPlan: any;
} | null>;
//# sourceMappingURL=calculationEngine.d.ts.map