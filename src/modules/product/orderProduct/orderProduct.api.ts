import type { IOrderProductResponse } from "@/interfaces/ApiResponse";
import { lamiAPI } from "@/services/axios.services";

export class OrderProductAPI{
    static getOne(orderId: number): Promise<{data: IOrderProductResponse}>{
        return lamiAPI.get(`/orderedProduct/one/${orderId}`);
    }
}