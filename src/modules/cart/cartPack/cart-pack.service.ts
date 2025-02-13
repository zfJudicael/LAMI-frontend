import type { ICartPack } from "@/models/Cart";
import { CartPackApi } from "./cart-pack.api";

export class CartPackService{
    static async create(params: ICartPack): Promise<ICartPack>{
        return (await CartPackApi.create(params)).data.data[0]
    }

    static async delete(cartId: number, packId: number): Promise<ICartPack>{
        return (await CartPackApi.delete(cartId, packId)).data.data[0]
    }

    static async update(params: ICartPack): Promise<ICartPack>{
        return (await CartPackApi.update(params)).data.data[0]
    }
}