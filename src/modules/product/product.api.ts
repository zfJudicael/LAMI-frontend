import type { IProduct } from "@/models/Product";
import { lamiAPI } from "@/services/axios.services";
import type { IProductResponse } from "@/interfaces/ApiResponse";

export class ProductAPI{
    static create(payload: IProduct): Promise<{data: IProductResponse}>{
        return lamiAPI.post('/product', payload);
    }

    static getOne(id: number): Promise<{data: IProductResponse}>{
        return lamiAPI.get(`/product/${id}`);
    }

    static getByCategory(params: string): Promise<{data: IProductResponse}>{
        return lamiAPI.get(`/product/category/${params}`);
    }

    static getByType(params: string): Promise<{data: IProductResponse}>{
        return lamiAPI.get(`/product/type/${params}`);
    }

    static getAll(): Promise<{data: IProductResponse}>{
        return lamiAPI.get('/product');
    }
}