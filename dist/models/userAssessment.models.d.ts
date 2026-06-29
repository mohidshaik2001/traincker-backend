import { Document, Types, Model } from "mongoose";
import type { IBiometrics } from "./biometrics.models.js";
export interface IUserAssessment extends Document {
    userId: Types.ObjectId;
    biometricsId: Types.ObjectId;
    dietPreferenceId: Types.ObjectId;
    customizedPlanId?: Types.ObjectId;
    isAssessmentCompleted: boolean;
}
interface IUserAssessmentModel extends Model<IUserAssessment> {
    assembleAssessmentData(this: IUserAssessmentModel, userId: string, processedBiometrics: IBiometrics, rawPreferences: any): Promise<IUserAssessment | null>;
}
declare const UserAssessment: IUserAssessmentModel;
export default UserAssessment;
//# sourceMappingURL=userAssessment.models.d.ts.map