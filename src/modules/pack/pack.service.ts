import type { IPackResponse } from "@/interfaces/ApiResponse";
import type { IPack } from "@/models/Pack";
import { PackAPI } from "./pack.api";

export class PackService{
    static async create(params: IPack): Promise<IPackResponse>{
        return (await PackAPI.create(params)).data;
    }

    static async getAll(): Promise<IPack[]>{
        return (await PackAPI.getAll()).data.data;
    }

    // static async delete(packId: number){
    //     return (await PackAPI.delete(packId))
    // }
}