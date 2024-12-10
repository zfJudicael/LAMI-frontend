import type { IType } from '@/models/Type';
import { lamiAPI } from "@/services/axios.services";
import type { ITypeResponse } from "@/interfaces/ApiResponse";

export class TypeAPI{
    static create(payload: IType): Promise<{data: ITypeResponse}>{
        return lamiAPI.post('/type', payload);
    }

    static getAll(): Promise<{data: ITypeResponse}>{
        return lamiAPI.get('/type');
    }

    static getByCategoryId(payload: string): Promise<{data: ITypeResponse}>{
        return lamiAPI.get(`/type/${payload}`)
    }
}