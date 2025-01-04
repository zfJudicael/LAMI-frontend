import type { ICategory } from "@/models/Category";
import type { IPack } from "@/models/Pack";
import type { IProduct } from "@/models/Product";
import type { IPromotion, IPromotionProduct } from "@/models/Promotion";
import type { IType } from "@/models/Type";
import type { IUser } from "@/models/User";

export interface IApiResponse{
    success: boolean;
    message: string;
    data: any;  
}

export interface ICategoryResponse extends IApiResponse{
    data: ICategory[]
}

export interface ITypeResponse extends IApiResponse{
    data: IType[]
}

export interface IProductResponse extends IApiResponse{
    data: IProduct[]
}

export interface IUserResponse extends IApiResponse{
    data: IUser[]
}

export interface IPackResponse extends IApiResponse{
    data: IPack[]
}

export interface IPromotionResponse extends IApiResponse{
    data: IPromotion[]
}

export interface IPromotionProductResponse extends IApiResponse{
    data: IPromotionProduct[]
}