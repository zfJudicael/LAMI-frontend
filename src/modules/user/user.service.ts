import type { IUserResponse } from "@/interfaces/ApiResponse";
import { UserAPI } from "./user.api";
import type { IUser } from "@/models/User";

export class UserService {
    static async create(params: IUser): Promise<IUserResponse>{
        return (await UserAPI.create(params)).data;
    }

    static async getAll(): Promise<IUser[]>{
        return (await UserAPI.getAll()).data.data;
    }
}