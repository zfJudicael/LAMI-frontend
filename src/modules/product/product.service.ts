import type { IProductResponse } from "@/interfaces/ApiResponse";
import type { IProduct } from "@/models/Product";
import { ProductAPI } from "./product.api";

export class ProductService {
    static async create(params: IProduct): Promise<IProductResponse>{
        return (await ProductAPI.create(params)).data;
    }

    static async getOne(id: number): Promise<IProduct>{
        return (await ProductAPI.getOne(id)).data.data[0]
    }

    static async getAll(): Promise<IProduct[]>{
        return (await ProductAPI.getAll()).data.data;
    }

    static async getByCategory(categoryId: string): Promise<IProduct[]>{
        return (await ProductAPI.getByCategory(categoryId)).data.data
    }

    static async getPublishedByCategory(categoryId: string): Promise<IProduct[]>{
        return (await ProductAPI.getPublishedByCategory(categoryId)).data.data
    }

    static async getByType(typeId: string): Promise<IProduct[]>{
        return (await ProductAPI.getByType(typeId)).data.data
    }

    static async getPublishedByType(typeId: string): Promise<IProduct[]>{
        return (await ProductAPI.getPublishedByType(typeId)).data.data
    }    

    static async editInformation(productId: number, params: Partial<IProduct>): Promise<IProduct>{
        return (await ProductAPI.editInformation(productId, params)).data.data[0]
    }

    static async changeProfilePicture(productId: number, params: Partial<IProduct>): Promise<IProduct>{
        return (await ProductAPI.changeProfilePicture(productId, params)).data.data[0]
    }

    static async changeOtherPictures(productId: number, params: Partial<IProduct>): Promise<IProduct>{
        return (await ProductAPI.changeOtherPictures(productId, params)).data.data[0]
    }

    static async updatePubishStatus(productId: number, params: Partial<IProduct>): Promise<IProduct>{
        return (await ProductAPI.updatePublishStatus(productId, params)).data.data[0]
    }

    static async delete(productId: number): Promise<IProduct>{
        return (await ProductAPI.delete(productId)).data.data[0]
    }
}