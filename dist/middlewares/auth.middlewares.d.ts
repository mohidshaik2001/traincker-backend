import type { Request, Response, NextFunction } from "express";
import type { IUser } from "../models/user.models.js";
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}
declare const authUser: (req: Request, res: Response, next: NextFunction) => void;
export { authUser };
//# sourceMappingURL=auth.middlewares.d.ts.map