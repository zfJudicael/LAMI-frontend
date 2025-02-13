import type { ICartProduct } from "@/models/Cart";
import { CartProductApi } from "./cart-product.api";

export class CartProductService{
    static async create(params: ICartProduct): Promise<ICartProduct>{
        return (await CartProductApi.create(params)).data.data[0]
    }

    static async delete(cartId: number, productId: number): Promise<ICartProduct>{
        return (await CartProductApi.delete(cartId, productId)).data.data[0]
    }

    static async update(params: ICartProduct): Promise<ICartProduct>{
        return (await CartProductApi.update(params)).data.data[0]
    }
}