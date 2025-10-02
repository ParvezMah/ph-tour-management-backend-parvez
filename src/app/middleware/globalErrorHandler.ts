
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */


import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/appError"
import { handleCastError } from "../helpers/handleCastError"
import { handlerDuplicateError } from "../helpers/handlerDuplicateError"
import { handlerValidationError } from "../helpers/handlerValidationError"
import { handlerZodError } from "../helpers/handlerZodError"
import { TErrorSources } from "../interfaces/error.types"




export const globalErrorHandler = (err: any, req:Request, res:Response, next:NextFunction)=>{
    if (envVars.NODE_ENV === "development") {
        console.log(err);
    }

    let errorSources : TErrorSources[] = [
    // {
    //     path: "isDeleted",
    //     message: "Cast Failed"
    // }
    ]
    let statusCode = 500
    let message = "Something went wrong from globar error handler"

    //Duplicate error
    //Duplicate error
    if (err.code === 11000) {
        const simplifiedError = handlerDuplicateError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message
    }
    // Cast Error - ObjectId error
    else if (err.name === "CastError") {
        const simplifiedError = handleCastError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message
    }
    // Zod error
    else if (err.name === "ZodError") {
        const simplifiedError = handlerZodError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSources = simplifiedError.errorSources as TErrorSources[]
    }
    // Validation error
    else if (err.name === "ValidationError") {
        const simplifiedError = handlerValidationError(err)
        statusCode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSources as TErrorSources[]
        message = simplifiedError.message
    }
    else if(err instanceof AppError){
        statusCode = err.statusCode
        message = err.message
    } 
    else if(err instanceof Error){
        statusCode = 500;
        message = err.message;
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err: envVars.NODE_ENV === "development" ? err : null,
        stack: envVars.NODE_ENV === "development" ? err.stack : null
    })
}