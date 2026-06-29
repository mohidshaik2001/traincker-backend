
import type { Request, Response, NextFunction } from "express";


type AppError=Error &{statusCode?:number,stack?:string}
export const ErrorResponse =(err:AppError,req:Request,res:Response,next:NextFunction)=>{
    const statusCode: number =err.statusCode || 500
    const message:string=err.message || "Internal Server Error"
    res.status(statusCode).json({
        statusCode,
        success:false,
         message,
        ...(process.env.NODE_ENV!=="production" && {stack:err.stack})
    })
}