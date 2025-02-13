import type { IUser, IUserAuth } from "@/models/User";
import { AuthApi } from "./auth.api";
import type { IAuthResponse } from "@/interfaces/AuthResponse";
import type { IAuthenticatedUser } from "@/models/User";
import { useAuthStore } from "@/stores/auth.store";
import router from "@/router";

export class AuthService {
    static async signUp(params: IUser): Promise<IAuthResponse> {
        return (await AuthApi.signUp(params)).data
    }

    static async signIn(params: IUserAuth): Promise<IAuthResponse>{
        return (await AuthApi.signIn(params)).data
    }   

    static async getMe(): Promise<IAuthenticatedUser>{
        return (await AuthApi.getMe()).data.data
    }

    static logOut(){
        useAuthStore().user = undefined
        this.clearToken()
        router.push({name: 'home'})
    }

    static setToken(token: string){
        sessionStorage.setItem('lamiToken', token)
    }

    static getToken(){
        return sessionStorage.getItem('lamiToken')
    }

    static clearToken(){
        sessionStorage.removeItem('lamiToken')
    }
}
