import type { IPromotion } from "@/models/Promotion";
import { PromotionAPI } from "./promotion.api";
import type { IPromotionResponse } from "@/interfaces/ApiResponse";

export class PromotionService{
    static async create(params: IPromotion): Promise<IPromotionResponse>{
        return (await PromotionAPI.create(params)).data
    }

    static async getActivePromotion(): Promise<IPromotion[]>{
        return (await PromotionAPI.getActivePromotion()).data.data
    }

    static async getAll(): Promise<IPromotion[]>{
        return (await PromotionAPI.getAll()).data.data
    }

    static async getPromotionNotLinkedToProduct(productId: number): Promise<IPromotion[]>{
        return (await PromotionAPI.getPromotionNotLinkedToProduct(productId)).data.data
    }

    static async deletePromotion(promotionId: number): Promise<IPromotionResponse>{
        return (await PromotionAPI.delete(promotionId)).data
    }

    static async update(promotionId: number, params: Partial<IPromotion>): Promise<IPromotionResponse>{
        return (await PromotionAPI.update(promotionId, params)).data
    }
}