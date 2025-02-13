import type { IPackProduct } from "@/models/Pack";
import { PackProductApi } from "./pack.product.api";
import type { IPackProductResponse } from "@/interfaces/ApiResponse";

export class PackProductService{
    static async editQuantity(params: IPackProduct): Promise<IPackProductResponse>{
        return (await PackProductApi.patch(params)).data
    }

    static async delete(packId: number, productId: number): Promise<IPackProductResponse>{
        return (await PackProductApi.delete(packId, productId)).data
    }
}