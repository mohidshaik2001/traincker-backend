import type { Document, Model } from "mongoose";
export interface IUser extends Document {
    fullName: string;
    userName?: string;
    email: string;
    password: string;
}
export interface IUserMethods {
    isPasswordMatch(password: string): Promise<boolean>;
    generateAccessTokens(): string;
}
interface IUserModel extends Model<IUser, {}, IUserMethods> {
    getUserByUserName(userName: string, password: string): Promise<IUser | null>;
    createUser(user: Partial<IUser>): Promise<IUser>;
}
declare const User: IUserModel;
export default User;
//# sourceMappingURL=user.models.d.ts.map