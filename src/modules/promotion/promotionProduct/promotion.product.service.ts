import type { IPromotionProductResponse } from "@/interfaces/ApiResponse";
import { PromotionProductAPI } from "./promotion.product.api";
import type { IPromotionProduct } from "@/models/Promotion";

export class PromotionProductSerive {
    static async create(params: IPromotionProduct): Promise<IPromotionProductResponse> {
        return (await PromotionProductAPI.create(params)).data
    }

    static async delete(promotionId: number, productId: number): Promise<IPromotionProductResponse>{
        return (await PromotionProductAPI.delete(promotionId, productId)).data
    }

    static async updateApplicationDate(promotionId: number, productId: number, applicationDate: Date): Promise<IPromotionProductResponse>{
            return (await PromotionProductAPI.updateApplicationDate(promotionId, productId, applicationDate)).data
    }
}