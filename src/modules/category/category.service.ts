import type { ICategoryResponse } from "@/interfaces/ApiResponse";
import type { ICategory } from "@/models/Category";
import { CategoryAPI } from "./category.api";

export class CategoryService {
    static async create(params: ICategory): Promise<ICategoryResponse>{
        return (await CategoryAPI.create(params)).data;
    }

    static async getAll(): Promise<ICategory[]>{
        return (await CategoryAPI.getAll()).data.data;
    }
}