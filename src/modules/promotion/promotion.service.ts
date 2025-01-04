import type { IPromotion } from "@/models/Promotion";
import { PromotionAPI } from "./promotion.api";
import type { IPromotionResponse } from "@/interfaces/ApiResponse";

export class PromotionService{
    static async create(params: IPromotion): Promise<IPromotionResponse>{
        return (await PromotionAPI.create(params)).data
    }

    static async getAll(): Promise<IPromotion[]>{
        return (await PromotionAPI.getAll()).data.data
    }
}