import type { IUser, IUserAuth } from "@/models/User";
import { lamiAPI } from "../../services/axios.services";
import type { IAuthenticatedUserResponse, IAuthResponse } from "@/interfaces/AuthResponse";

export class AuthApi{
    static signUp(payload: IUser): Promise<{data: IAuthResponse}>{
        return lamiAPI.post('/auth/signup', payload);
    }

    static signIn(payload: IUserAuth): Promise<{data: IAuthResponse}>{
        return lamiAPI.post('/auth/signin', payload);
    }

    static getMe(): Promise<{data: IAuthenticatedUserResponse}>{
        return lamiAPI.get('/auth/me');
    }
}
