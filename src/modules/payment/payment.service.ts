import { PaymentApi } from "./payment.api";
import type { IPayment, IPaymentMethodCount } from "@/models/Payment";

export class PaymentService{
    static async getMyPayment(): Promise<IPayment[]>{
        return (await PaymentApi.getMyPayment()).data.data
    }

    static async getAll(paymentDate: string): Promise<IPayment[]>{
        return (await PaymentApi.getAll(paymentDate)).data.data
    }

    static async getOne(orderId: number): Promise<IPayment>{
        return (await PaymentApi.getOne(orderId)).data.data[0]
    }

    static async getPaymentMethodCount(): Promise<IPaymentMethodCount[]>{
        return (await PaymentApi.getPaymentMethodCount()).data.data
    }

    static async getPaymentCount(): Promise<{paymentCount: number}>{
        return (await PaymentApi.getPaymentCount()).data.data
    }
}