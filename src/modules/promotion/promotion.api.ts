import type { IPromotionResponse } from "@/interfaces/ApiResponse";
import type { IPromotion } from "@/models/Promotion";
import { lamiAPI } from "@/services/axios.services";

export class PromotionAPI{
    static async create(payload: IPromotion): Promise<{data :IPromotionResponse}>{
        return lamiAPI.post('/promotion', payload)
    }

    static async getAll(): Promise<{data: IPromotionResponse}>{
        return lamiAPI.get('/promotion')
    }
}