import type { IProduct } from "./Product";

export interface IPromotion{
    id?: number;
    namePromotion: string;
    discount: number;
    start_date: Date;
    end_date: Date;
    promotionProducts?: IPromotionProduct[]
}

export interface IPromotionProduct{
    promotionId: number;
    productId: number;
    application_date: Date;
    promotion?: IPromotion;
    product?: IProduct;
}