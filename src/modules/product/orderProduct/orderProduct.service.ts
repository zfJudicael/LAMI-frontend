import type { IOrderedProduct } from "@/models/Order";
import { OrderProductAPI } from "./orderProduct.api";

export class OrderProductService {
    static async getOne(orderId: number): Promise<IOrderedProduct[]>{
        return (await OrderProductAPI.getOne(orderId)).data.data
    }
}