import type { IPackResponse } from "@/interfaces/ApiResponse";
import type { IPack } from "@/models/Pack";
import { PackAPI } from "./pack.api";

export class PackService{
    static async create(params: IPack): Promise<IPackResponse>{
        return (await PackAPI.create(params)).data;
    }

    static async update(packId: number, params: Partial<IPack>): Promise<IPackResponse>{
        return (await PackAPI.update(packId, params)).data
    }

    static async getAll(): Promise<IPack[]>{
        return (await PackAPI.getAll()).data.data;
    }

    static async getPublishedPack(): Promise<IPack[]>{
        return (await PackAPI.getPublishedPack()).data.data
    }

    static async delete(packId: number): Promise<IPackResponse>{
        return (await PackAPI.delete(packId)).data
    }
}