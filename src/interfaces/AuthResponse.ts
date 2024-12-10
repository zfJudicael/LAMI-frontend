export interface IAuthResponse{
    access_token: string
}

export enum AuthERROR{
    EMAIL_IN_USE = 'EMAIL_IN_USE',
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    WRONG_PASSWORD = 'WRONG_PASSWORD',
}