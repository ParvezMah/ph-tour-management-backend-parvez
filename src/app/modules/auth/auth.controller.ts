/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status-codes"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { AuthServices } from "./auth.service"
import AppError from "../../errorHelpers/appError"



const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body)


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged In Successfully",
        data: loginInfo,
    })
})


const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // const refreshToken = req.cookies.refreshToken;
    const refreshToken = req.headers.authorization;
    console.log("refreshToken : ", refreshToken)
    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "No refresh token recieved from cookies")
    }
    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "New Access Token Retrived Successfully",
        data: tokenInfo,
    })
})

export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken
}