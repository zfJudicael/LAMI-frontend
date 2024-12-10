import type { IUser, IUserAuth } from "@/models/User";
import { lamiAPI, lamiAuth } from "../../services/axios.services";
import type { IAuthResponse } from "@/interfaces/AuthResponse";
import type { IAuthenticatedUser } from "@/models/User";

export class AuthApi{
    static signUp(payload: IUser): Promise<{data: IAuthResponse}>{
        return lamiAuth.post('/signup', payload);
    }

    static signIn(payload: IUserAuth): Promise<{data: IAuthResponse}>{
        return lamiAuth.post('/signin', payload);
    }

    static getMe(): Promise<{data: IAuthenticatedUser}>{
        return lamiAPI.get('/auth/me');
    }
}
