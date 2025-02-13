import type { IRefundResponse } from "@/interfaces/ApiResponse";
import { RefundApi } from "./refund.api";
import type { IRefund } from "@/models/Refund";

export interface CreateRefundDto {
    amountRefunded: number;
    reason: string;
    orderId: number;
    userId: number;
}

export class RefundService{
    static async create(params: CreateRefundDto): Promise<IRefundResponse>{
        return (await RefundApi.create(params)).data
    }

    static async getAll(): Promise<IRefund[]>{
        return (await RefundApi.getAll()).data.data
    }

    static async getMyRefund(): Promise<IRefund[]>{
        return (await RefundApi.getMyRefund()).data.data
    }

    static async getRefundCount(): Promise<{refundCount: number}>{
        return (await RefundApi.getRefundCount()).data.data
    }

    static async getOne(orderId: number): Promise<IRefund>{
        return (await RefundApi.getOne(orderId)).data.data[0]
    }

    static async getCurrentMonthRefundTotal(): Promise<{totalAmount: number}>{
        return (await RefundApi.getCurrentMonthRefundTotal()).data.data
    }
}