import type { ICartPackResponse } from "@/interfaces/ApiResponse";
import type { ICartPack } from "@/models/Cart";
import { lamiAPI } from "@/services/axios.services";

export class CartPackApi{
    static async create(payload: ICartPack): Promise<{data: ICartPackResponse}>{
        return lamiAPI.post('cart-pack', payload)
    }

    static async delete(cartId: number, packId: number): Promise<{data: ICartPackResponse}>{
        return lamiAPI.delete(`/cart-pack/${cartId}/${packId}`)
    }

    static async update(payload: ICartPack): Promise<{data: ICartPackResponse}>{
        return lamiAPI.patch('/cart-pack/quantity', payload)
    }
}