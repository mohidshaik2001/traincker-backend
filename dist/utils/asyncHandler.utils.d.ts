import type { Request, Response, NextFunction } from 'express';
type requestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const asyncHandler: (requestHandler: requestHandler) => (req: Request, res: Response, next: NextFunction) => void;
export { asyncHandler };
//# sourceMappingURL=asyncHandler.utils.d.ts.map