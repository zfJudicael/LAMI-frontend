import { CartAPI } from "./cart.api";
import type { ICartResponse } from "@/interfaces/ApiResponse";

export class CartService{
    static async create(): Promise<ICartResponse>{
        return (await CartAPI.create()).data
    }

    static async getOne(): Promise<ICartResponse>{
        return (await CartAPI.getOne()).data
    }

    static async clear(cartId: number): Promise<ICartResponse>{
        return (await CartAPI.clear(cartId)).data
    }

    static async validate(cartId: number): Promise<ICartResponse>{
        return (await CartAPI.validate(cartId)).data
    }
}