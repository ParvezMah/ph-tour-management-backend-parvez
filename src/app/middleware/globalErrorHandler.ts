/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */


import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/appError"

export const globalErrorHandler = (err: any, req:Request, res:Response, next:NextFunction)=>{

    const errorSource : any = [
    // {
    //     path: "isDeleted",
    //     message: "Cast Failed"
    // }
    ]
    let statusCode = 500
    let message = "Something went wrong from globar error handler"

    //Duplicate error
    if (err.code === 11000) {
        const matchedArray = err.message.match(/"([^"]*)"/)
        statusCode = 400;
        message = `${matchedArray[1]} Already Exist`
    }
    // Cast Error - ObjectId error
    else if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid MongoDB ObjectId. Please provide a valid Id"
    }
    // Validation error
    else if (err.name === "ValidationError") {
        statusCode = 400;
        const errors = Object.values(err.errors);

        errors.forEach((errorObject : any) => errorSource.push({
            path: errorObject.path,
            message: errorObject.message
        }))
        message = "Validation Error Occurred"
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
        errorSource,
        // err,
        stack: envVars.NODE_ENV === "development" ? err.stack : null
    })
}