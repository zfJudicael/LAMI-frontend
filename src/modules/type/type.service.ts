import type { ITypeResponse } from "@/interfaces/ApiResponse";
import { TypeAPI } from "./type.api";
import type { IType } from "@/models/Type";

export class TypeService {
    static async create(params: IType): Promise<ITypeResponse>{
        return (await TypeAPI.create(params)).data;
    }

    static async getAll(): Promise<IType[]>{
        return (await TypeAPI.getAll()).data.data;
    }

    static async getByCategoryId(params: string): Promise<IType[]>{
        return (await TypeAPI.getByCategoryId(params)).data.data
    }
}