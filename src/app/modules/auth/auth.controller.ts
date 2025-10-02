/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status-codes"
import AppError from "../../errorHelpers/appError"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { setAuthCookie } from "../../utils/setAuthCookie"
import { AuthServices } from "./auth.service"
import { createUserTokens } from "../../utils/userTokens"
import { envVars } from "../../config/env"
import { JwtPayload } from "jsonwebtoken"
import passport from "passport"



const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // const loginInfo = await AuthServices.credentialsLogin(req.body)

    passport.authenticate();

    // res.cookie("accessToken", loginInfo.accessToken, {
    //     httpOnly: true, // httpOnly: true This makes the cookie inaccessible to JavaScript running in the browser (it can't be read or modified by document.cookie). Purpose: Helps protect against XSS (Cross-Site Scripting) attacks.
    //     secure: false, // secure: false This means the cookie will be sent over both HTTP and HTTPS connections. Purpose: In development, you often use secure: false because you may not have HTTPS locally. In production, you should set secure: true so the cookie is only sent over HTTPS, making it more secure.
    // })

    // res.cookie("refreshToken", loginInfo.refreshToken, {
    //     httpOnly: true, // httpOnly: true This makes the cookie inaccessible to JavaScript running in the browser (it can't be read or modified by document.cookie). Purpose: Helps protect against XSS (Cross-Site Scripting) attacks.
    //     secure: false, // secure: false This means the cookie will be sent over both HTTP and HTTPS connections. Purpose: In development, you often use secure: false because you may not have HTTPS locally. In production, you should set secure: true so the cookie is only sent over HTTPS, making it more secure.
    // })

    setAuthCookie(res, loginInfo)


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged In Successfully",
        data: loginInfo,
    })
})


const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    // const refreshToken = req.headers.authorization;
    // console.log(refreshToken)

    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "There is No refresh token recieved from cookies")
    }
    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string)

    // res.cookie("accessToken", tokenInfo.accessToken, {
    //     httpOnly: true, // httpOnly: true This makes the cookie inaccessible to JavaScript running in the browser (it can't be read or modified by document.cookie). Purpose: Helps protect against XSS (Cross-Site Scripting) attacks.
    //     secure: false, // secure: false This means the cookie will be sent over both HTTP and HTTPS connections. Purpose: In development, you often use secure: false because you may not have HTTPS locally. In production, you should set secure: true so the cookie is only sent over HTTPS, making it more secure.
    // })


    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "New Access Token Retrived Successfully",
        data: tokenInfo,
    })
})

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged Out Successfully",
        data: null,
    })
})



// "success": false,
// "message": "jwt malformed",
// "err": {
//     "name": "JsonWebTokenError",
//     "message": "jwt malformed"
// },

const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user

    await AuthServices.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password Changed Successfully",
        data: null,
    })
})

const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? req.query.state as string : ""

    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1)
    }

    // /booking => booking , => "/" => ""
    const user = req.user;
    console.log("googleCallbackController : ", user);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }

    const tokenInfo = createUserTokens(user)

    setAuthCookie(res, tokenInfo)

    // sendResponse(res, {
    //     success: true,
    //     statusCode: httpStatus.OK,
    //     message: "Password Changed Successfully",
    //     data: null,
    // })

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
})

export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    googleCallbackController
}