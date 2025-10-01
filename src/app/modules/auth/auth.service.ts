import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../../utils/userTokens";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";

const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload;

    const isUserExist = await User.findOne({ email })
    console.log("isUserExist : ", isUserExist);

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist")
    }

    const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string)

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password: pass, ...rest}=isUserExist.toObject();

    const userTokens = createUserTokens(isUserExist);

    // delete isUserExist.password;

    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest
    }

}

const getNewAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)

    return {
        accessToken: newAccessToken
    }

}

//user - login - token (email, role, _id) - booking / payment / booking / payment cancel - token 

export const AuthServices = {
    credentialsLogin,
    getNewAccessToken
}