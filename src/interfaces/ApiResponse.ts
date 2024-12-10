import type { ICategory } from "@/models/Category";
import type { IProduct } from "@/models/Product";
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