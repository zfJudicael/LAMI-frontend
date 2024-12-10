import type { ICategory } from "@/models/Category";
import { lamiAPI } from "@/services/axios.services";
import type { ICategoryResponse } from "@/interfaces/ApiResponse";

export class CategoryAPI{
    static create(payload: ICategory): Promise<{data: ICategoryResponse}>{
        return lamiAPI.post('/category', payload);
    }

    static getAll(): Promise<{data: ICategoryResponse}>{
        return lamiAPI.get('/category');
    }
}