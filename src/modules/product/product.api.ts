import type { IProduct } from "@/models/Product";
import { lamiAPI } from "@/services/axios.services";
import type { IProductResponse } from "@/interfaces/ApiResponse";

export class ProductAPI{
    static create(payload: IProduct): Promise<{data: IProductResponse}>{
        return lamiAPI.post('/product', payload);
    }

    static getOne(id: number): Promise<{data: IProductResponse}>{
        return lamiAPI.get(`/product/one/${id}`);
    }

    static getByCategory(params: string): Promise<{data: IProductResponse}>{
        return lamiAPI.get(`/product/category/${params}`);
    }

    static getPublishedByCategory(categoryId: string, priceOrder: string): Promise<{data: IProductResponse}>{
        return lamiAPI.get(`/product/category/published/${categoryId}/${priceOrder}`);
    }

    static getByType(typeId: string): Promise<{data: IProductResponse}>{
        return lamiAPI.get(`/product/type/${typeId}`);
    }

    static getPublishedByType(params: string, priceOrder: string): Promise<{data: IProductResponse}>{
        return lamiAPI.get(`/product/type/published/${params}/${priceOrder}`);
    }

    static getAll(): Promise<{data: IProductResponse}>{
        return lamiAPI.get('/product/all');
    }

    static getLastUpdated(): Promise<{data: IProductResponse}>{
        return lamiAPI.get('/product/lastUpdated');
    }

    static getByName(name_product: string): Promise<{data: IProductResponse}>{
        return lamiAPI.get(`/product/nameProduct/${name_product}`);
    }

    static editInformation(id: number, payload: Partial<IProduct>): Promise<{data: IProductResponse}>{
        return lamiAPI.patch(`/product/information/${id}`, payload);
    }

    static editAvailableQuantity(id: number, payload: Partial<IProduct>): Promise<{data: IProductResponse}>{
        return lamiAPI.patch(`/product/quantity/${id}`, payload);
    }

    static changeProfilePicture(id: number, payload: Partial<IProduct>): Promise<{data: IProductResponse}>{
        return lamiAPI.patch(`/product/profilePicture/${id}`, payload);
    }

    static changeOtherPictures(id: number, payload: Partial<IProduct>): Promise<{data: IProductResponse}>{
        return lamiAPI.patch(`/product/otherPictures/${id}`, payload);
    }

    static updatePublishStatus(id: number, payload: Partial<IProduct>): Promise<{data: IProductResponse}>{
        return lamiAPI.patch(`product/publish/${id}`, payload)
    }

    static delete(id: number): Promise<{data: IProductResponse}>{
        return lamiAPI.delete(`product/${id}`)
    }
}