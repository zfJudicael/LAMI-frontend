import type { IPromotionProductResponse } from "@/interfaces/ApiResponse";
import type { IPromotionProduct } from "@/models/Promotion";
import { lamiAPI } from "@/services/axios.services";

export class PromotionProductAPI {
    static create(payload: IPromotionProduct): Promise<{data: IPromotionProductResponse}>{
        return lamiAPI.post('/promotion-product', payload)
    }

    static delete(promotionId: number, productId: number): Promise<{data: IPromotionProductResponse}>{
        return lamiAPI.delete(`/promotion-product/${promotionId}/${productId}`)
    }

    static updateApplicationDate(promotionId: number, productId: number, applicationDate: Date): Promise<{data: IPromotionProductResponse}>{
        return lamiAPI.patch(`/promotion-product/${promotionId}/${productId}`, {applicationDate})
    }
}