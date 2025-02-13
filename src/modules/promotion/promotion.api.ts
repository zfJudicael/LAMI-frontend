import type { IPromotionResponse } from "@/interfaces/ApiResponse";
import type { IPromotion } from "@/models/Promotion";
import { lamiAPI } from "@/services/axios.services";

export class PromotionAPI{
    static async create(payload: IPromotion): Promise<{data :IPromotionResponse}>{
        return lamiAPI.post('/promotion', payload)
    }

    static async getActivePromotion(): Promise<{data: IPromotionResponse}>{
        return lamiAPI.get('/promotion/active')
    }

    static async getAll(): Promise<{data: IPromotionResponse}>{
        return lamiAPI.get('/promotion')
    }

    static async getPromotionNotLinkedToProduct(productId: number): Promise<{data : IPromotionResponse}>{
        return lamiAPI.get(`/promotion/${productId}`)
    }

    static async delete(promotionId: number): Promise<{data: IPromotionResponse}>{
        return lamiAPI.delete(`/promotion/${promotionId}`)
    }

    static async update(promotionId: number, payload: Partial<IPromotion>): Promise<{data: IPromotionResponse}>{
        return lamiAPI.patch(`/promotion/${promotionId}`, payload)
    }
}