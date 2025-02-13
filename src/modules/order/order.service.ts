import type { IOrderResponse } from "@/interfaces/ApiResponse";
import { OrderApi } from "./order.api";
import type { IOrder } from "@/models/Order";

export interface createOrderDto{
    accountNumber: string;
    amount: number;
    method: string;
    placeOfDelivery: string;
    cartId: number
}

export class OrderService{
    static async create(params: createOrderDto): Promise<IOrderResponse>{
        return (await OrderApi.create(params)).data
    }

    static async getMyOrders(): Promise<IOrderResponse>{
        return (await OrderApi.getMyOrders()).data
    }

    static async getAll(orderDate: string): Promise<IOrder[]>{
        return (await OrderApi.getAll(orderDate)).data.data
    }

    static async getOne(id: number): Promise<IOrder>{
        return (await OrderApi.getOne(id)).data.data[0]
    }

    static async getOrdersCountPerMonthInLastFiveMonths(): Promise<{month: Date, count: number}[]>{
        return (await OrderApi.getOrdersCountPerMonthInLastFiveMonths()).data.data
    }

    static async getOrdersCountForLastSevenDays(): Promise<{day: Date, count: number}[]>{
        return (await OrderApi.getOrdersCountForLastSevenDays()).data.data
    }

    static async getProductsSoldInMonth(year: number, month: number): Promise<{
        productId: number,
        productName: string,
        totalSold: number
    }[]>{
        return (await OrderApi.getProductsSoldInMonth(year, month)).data.data
    }

    static async getCurrentMonthOrderTotal(): Promise<{totalAmount: number}>{
        return (await OrderApi.getCurrentMonthOrderTotal()).data.data
    }
}