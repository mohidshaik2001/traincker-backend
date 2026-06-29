import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import type { Request, Response, NextFunction } from "express";
import User from "../models/user.models.js";
import type { IUser } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.utils.js";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

const authUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.cookies?.accessToken) {
        throw new Error("Access Token Not Found");
      }
      const token: string = req.cookies?.accessToken;

      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!,
      ) as jwt.JwtPayload;
      if (!decodedToken) {
        throw new Error("Invalid Access Token");
      }
      const user: IUser = await User.findById(decodedToken.userId).select(
        "-password",
      );

      if (!user) {
        throw new Error("Invalid Access Token");
      }
      req.user = user;
      next();
    } catch (error: any) {
      if (error instanceof Error) {
        throw new ApiError(401, [], error.message);
      }
    }
  },
);

export { authUser };
