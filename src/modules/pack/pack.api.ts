import type { IPackResponse } from "@/interfaces/ApiResponse";
import type { IPack } from "@/models/Pack";
import { lamiAPI } from "@/services/axios.services";

export class PackAPI{
    static create(payload: IPack): Promise<{data: IPackResponse}>{
        return lamiAPI.post('/pack', payload);
    }

    static getAll(): Promise<{data : IPackResponse}>{
        return lamiAPI.get('/pack');
    }

    // static delete(id: number){
    //     return lamiAPI.delete(`/pack/${id}`)
    // }
}