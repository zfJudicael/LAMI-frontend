import type { IRefundCountResponse, IRefundResponse, ITotalAmountResponse } from "@/interfaces/ApiResponse";
import { lamiAPI } from "@/services/axios.services";
import type { CreateRefundDto } from "./refund.service";

export class RefundApi{
    static async create(payload: CreateRefundDto): Promise<{data: IRefundResponse}>{
        return lamiAPI.post('refund', payload)
    }

    static async getAll(): Promise<{data: IRefundResponse}>{
        return lamiAPI.get('refund/all')
    }

    static async getMyRefund(): Promise<{data: IRefundResponse}>{
        return lamiAPI.get(`refund/myRefund`)
    }

    static async getRefundCount(): Promise<{data: IRefundCountResponse}>{
        return lamiAPI.get('refund/count')
    }

    static async getOne(orderId: number): Promise<{data: IRefundResponse}>{
        return lamiAPI.get(`/refund/one/${orderId}`)
    }

    static async getCurrentMonthRefundTotal(): Promise<{data: ITotalAmountResponse}>{
        return lamiAPI.get(`/refund/currentMonthRefundTotal`)
    }
}