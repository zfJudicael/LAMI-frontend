import type { ICart, ICartPack, ICartProduct } from "@/models/Cart";
import type { ICategory } from "@/models/Category";
import type { IOrder, IOrderedProduct } from "@/models/Order";
import type { IPack, IPackProduct } from "@/models/Pack";
import type { IPayment, IPaymentMethodCount } from "@/models/Payment";
import type { IProduct } from "@/models/Product";
import type { IPromotion, IPromotionProduct } from "@/models/Promotion";
import type { IRefund } from "@/models/Refund";
import type { IReservation } from "@/models/Reservation";
import type { IType } from "@/models/Type";
import type { IUser } from "@/models/User";

export interface IApiResponse{
    success: boolean;
    message: string;
    data: any;  
}

export interface ICategoryResponse extends IApiResponse{
    data: ICategory[]
}

export interface ITypeResponse extends IApiResponse{
    data: IType[]
}

export interface IProductResponse extends IApiResponse{
    data: IProduct[]
}

export interface IUserResponse extends IApiResponse{
    data: IUser[]
}

export interface IPackResponse extends IApiResponse{
    data: IPack[]
}

export interface IPackProductResponse extends IApiResponse{
    data: IPackProduct[]
}

export interface IPromotionResponse extends IApiResponse{
    data: IPromotion[]
}

export interface IPromotionProductResponse extends IApiResponse{
    data: IPromotionProduct[]
}

export interface ICartResponse extends IApiResponse{
    data: ICart[]
}

export interface ICartProductResponse extends IApiResponse{
    data: ICartProduct[]
}

export interface ICartPackResponse extends IApiResponse{
    data: ICartPack[]
}

export interface IReservationResponse extends IApiResponse{
    data: IReservation[]
}

export interface IOrderResponse extends IApiResponse{
    data: IOrder[]
}

export interface IOrdersCountPerMonth extends IApiResponse{
    data: {
        month: Date,
        count: number
    }[]
}

export interface IOrdersCountPerDay extends IApiResponse{
    data: {
        day: Date,
        count: number
    }[]
}

export interface IProductsSoldInMonth extends IApiResponse{
    data: {
        productId: number,
        productName: string,
        totalSold: number
    }[]
}

export interface IPaymentResponse extends IApiResponse{
    data: IPayment[]
}

export interface IRefundResponse extends IApiResponse{
    data: IRefund[] 
}

export interface IPaymentMethodResponse extends IApiResponse{
    data: IPaymentMethodCount[]
}

export interface IRefundCountResponse extends IApiResponse{
    data: {
        refundCount: number
    }
}

export interface IPaymentCountResponse extends IApiResponse{
    data: {
        paymentCount: number
    }
}

export interface IOrderProductResponse extends IApiResponse{
    data: IOrderedProduct[]
}

export interface ITotalAmountResponse extends IApiResponse{
    data: {
        totalAmount: number
    }
}

