import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import User from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.utils.js";
const authUser = asyncHandler(async (req, res, next) => {
    try {
        if (!req.cookies?.accessToken) {
            throw new Error("Access Token Not Found");
        }
        const token = req.cookies?.accessToken;
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decodedToken) {
            throw new Error("Invalid Access Token");
        }
        const user = await User.findById(decodedToken.userId).select("-password");
        if (!user) {
            throw new Error("Invalid Access Token");
        }
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof Error) {
            throw new ApiError(401, [], error.message);
        }
    }
});
export { authUser };
//# sourceMappingURL=auth.middlewares.js.map