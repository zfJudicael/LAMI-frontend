import type { IPackProductResponse } from "@/interfaces/ApiResponse";
import type { IPackProduct } from "@/models/Pack";
import { lamiAPI } from "@/services/axios.services";

export class PackProductApi{
    static async patch(payload: IPackProduct): Promise<{data: IPackProductResponse}>{
        return lamiAPI.patch('/pack-product/', payload)
    }

    static async delete(packId: number, productId: number): Promise<{data: IPackProductResponse}>{
        return lamiAPI.delete(`/pack-product/${packId}/${productId}`)
    }
}