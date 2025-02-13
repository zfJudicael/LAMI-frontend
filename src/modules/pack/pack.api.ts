import type { IPackResponse } from "@/interfaces/ApiResponse";
import type { IPack } from "@/models/Pack";
import { lamiAPI } from "@/services/axios.services";

export class PackAPI{
    static create(payload: IPack): Promise<{data: IPackResponse}>{
        return lamiAPI.post('/pack', payload);
    }

    static update(id: number, payload: Partial<IPack>): Promise<{data: IPackResponse}>{
        return lamiAPI.patch(`/pack/${id}`, payload)
    }

    static getAll(): Promise<{data : IPackResponse}>{
        return lamiAPI.get('/pack');
    }

    static getPublishedPack(): Promise<{data: IPackResponse}>{
        return lamiAPI.get('pack/published');
    }

    static delete(id: number): Promise<{data: IPackResponse}>{
        return lamiAPI.delete(`/pack/${id}`)
    }
}