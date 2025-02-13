import type { ICartResponse } from "@/interfaces/ApiResponse";
import type { ICart } from "@/models/Cart";
import { lamiAPI } from "@/services/axios.services";

export class CartAPI{
    static create(): Promise<{data: ICartResponse}>{
        return lamiAPI.post('/cart/create')
    }

    static getOne(): Promise<{data: ICartResponse}>{
        return lamiAPI.get(`/cart`)
    }

    static clear(cartId: number): Promise<{data: ICartResponse}>{
        return lamiAPI.delete(`/cart/${cartId}`)
    }

    static validate(cartId: number): Promise<{data: ICartResponse}>{
        return lamiAPI.post(`/cart/validate/${cartId}`)
    }
}