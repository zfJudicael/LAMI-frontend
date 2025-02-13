import type { IPayment } from "./Payment";
import type { IProduct } from "./Product";
import type { IUser } from "./User";

export enum PaiementStatus{
    PAID = 'PAID',
    REFUNDED = 'REFUNDED'
}


export interface IOrder{
    id: number;
    userId: number;
    order_date: Date;
    amount: number;
    placeOfDelivery: string;
    delivery_date: Date;
    paiementStatus: PaiementStatus;
    orderedProducts?: IOrderedProduct[];
    isSeen?: boolean;
    user?: IUser;
}

export interface IOrderedProduct{
    orderId: number;
    productId: number;
    quantityOrdered: number;
    
    order?: IOrder;
    product?: IProduct;
}
