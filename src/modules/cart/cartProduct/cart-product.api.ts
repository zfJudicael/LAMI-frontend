import type { ICartProductResponse } from "@/interfaces/ApiResponse";
import type { ICartProduct } from "@/models/Cart";
import { lamiAPI } from "@/services/axios.services";

export class CartProductApi{
    static async create(payload: ICartProduct): Promise<{data: ICartProductResponse}>{
        return lamiAPI.post('/cart-product', payload)
    }

    static async delete(cartId: number, productId: number): Promise<{data: ICartProductResponse}>{
        return lamiAPI.delete(`/cart-product/${cartId}/${productId}`)
    }

    static async update(payload: ICartProduct): Promise<{data: ICartProductResponse}>{
        return lamiAPI.patch('/cart-product/quantity', payload)
    }
}