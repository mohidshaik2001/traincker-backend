
import type { Request, Response, NextFunction } from 'express';
import { error } from 'node:console';

type requestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>
const asyncHandler = (requestHandler:requestHandler)=>{
    return (req:Request,res:Response,next:NextFunction)=>{ Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))}
}

export {asyncHandler}


