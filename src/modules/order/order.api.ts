import type { IOrderResponse, IOrdersCountPerDay, IOrdersCountPerMonth, IProductsSoldInMonth, ITotalAmountResponse } from "@/interfaces/ApiResponse";
import { lamiAPI } from "@/services/axios.services";
import type { createOrderDto } from "./order.service";

export class OrderApi{
    static async create(payload: createOrderDto): Promise<{data: IOrderResponse}>{
        return lamiAPI.post('/order', payload)
    }

    static async getMyOrders(): Promise<{data: IOrderResponse}>{
        return lamiAPI.get('/order/mine')
    }

    static async getAll(orderDate: string): Promise<{data: IOrderResponse}>{
        return lamiAPI.get(`/order/all/${orderDate}`)
    }

    static async getOne(id: number): Promise<{data: IOrderResponse}>{
        return lamiAPI.get(`/order/one/${id}`)
    }

    static async getOrdersCountPerMonthInLastFiveMonths(): Promise<{data: IOrdersCountPerMonth}>{
        return lamiAPI.get('/order/ordersCountPerMonthInLastFiveMonths')
    }

    static async getOrdersCountForLastSevenDays(): Promise<{data: IOrdersCountPerDay}>{
        return lamiAPI.get('/order/ordersCountForLastSevenDays')
    }

    static async getProductsSoldInMonth(year: number, month: number): Promise<{data: IProductsSoldInMonth}>{
        return lamiAPI.get(`/order/productsSoldInMonth/${year}/${month}`)
    }

    static async getCurrentMonthOrderTotal(): Promise<{data: ITotalAmountResponse}>{
        return lamiAPI.get(`/order/currentMonthOrderTotal`)
    }
}