import type { Request, Response, NextFunction } from "express";
type AppError = Error & {
    statusCode?: number;
    stack?: string;
};
export declare const ErrorResponse: (err: AppError, req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=ErrorResponse.utils.d.ts.map