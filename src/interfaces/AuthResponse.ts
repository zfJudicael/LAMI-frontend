import type { IAuthenticatedUser } from "@/models/User"

export interface IAuthResponse{
    success: boolean,
    message: string,
    data: string
}

export interface IAuthenticatedUserResponse{
    success: boolean,
    message: string,
    data: IAuthenticatedUser
}

export enum AuthERROR{
    EMAIL_IN_USE = 'EMAIL_IN_USE',
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    WRONG_PASSWORD = 'WRONG_PASSWORD',
}