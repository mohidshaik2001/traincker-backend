import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.utils.js";
const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true });
userSchema.pre("save", async function () {
    try {
        if (this.isModified("password")) {
            const salt = bcrypt.genSaltSync(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
        if (!this.userName && this.fullName) {
            const base = this.fullName.replace(/\s+/g, "").toLowerCase();
            const random_num = Math.floor(1000 + Math.random() * 9000);
            this.userName = `${base}${random_num}`;
        }
    }
    catch (error) {
        if (error instanceof Error)
            throw new ApiError(500, [], error.message);
    }
});
userSchema.methods.isPasswordMatch = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    }
    catch (error) {
        if (error instanceof Error)
            throw new ApiError(500, [], error.message);
        return false;
    }
};
userSchema.statics.getUserByUserName = async function (userName, password) {
    try {
        if (!userName || !password)
            return null;
        const user = await this.findOne({ userName });
        if (!user)
            return null;
        const isPasswordMatch = await user.isPasswordMatch(password);
        if (!isPasswordMatch)
            return null;
        return user;
    }
    catch (error) {
        if (error instanceof Error)
            throw new ApiError(500, [], error.message);
        return null;
    }
};
userSchema.statics.createUser = async function (user) {
    try {
        const newUser = new this(user);
        await newUser.save();
        return newUser;
    }
    catch (error) {
        if (error instanceof Error)
            throw new ApiError(500, [], error.message);
        throw error;
    }
};
userSchema.methods.generateAccessTokens = function () {
    return jwt.sign({
        userId: this._id,
        userName: this.userName,
        email: this.email,
        fullName: this.fullName,
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
};
const User = model("User", userSchema);
export default User;
//# sourceMappingURL=user.models.js.map