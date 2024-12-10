import type { IUser } from '@/models/User';
import { lamiAPI } from "@/services/axios.services";
import type { IUserResponse } from "@/interfaces/ApiResponse";

export class UserAPI{
    static create(payload: IUser): Promise<{data: IUserResponse}>{
        return lamiAPI.post('/user/create', payload);
    }

    static getAll(): Promise<{data: IUserResponse}>{
        return lamiAPI.get('/user');
    }
}