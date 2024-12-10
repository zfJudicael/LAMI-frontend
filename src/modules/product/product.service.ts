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

    static async getByType(typeId: string): Promise<IProduct[]>{
        return (await ProductAPI.getByType(typeId)).data.data
    }
}