import type { IPaymentCountResponse, IPaymentMethodResponse, IPaymentResponse } from "@/interfaces/ApiResponse";
import { lamiAPI } from "@/services/axios.services";

export class PaymentApi{
    static async getMyPayment(): Promise<{data: IPaymentResponse}>{
        return lamiAPI.get(`/payment/myPayment`)
    }

    static async getAll(paymentDate: string): Promise<{data: IPaymentResponse}>{
        return lamiAPI.get(`/payment/all/${paymentDate}`)
    }

    static async getPaymentMethodCount(): Promise<{data: IPaymentMethodResponse}>{
        return lamiAPI.get('/payment/methodCount')
    }

    static async getPaymentCount(): Promise<{data: IPaymentCountResponse}>{
        return lamiAPI.get('/payment/paymentCount')
    }

    static getOne(orderId: number): Promise<{data: IPaymentResponse}>{
        return lamiAPI.get(`/payment/one/${orderId}`)
    }
}