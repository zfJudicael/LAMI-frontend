import type { IPack } from "./Pack";
import type { IProduct } from "./Product";

export interface ICart {
    id?: number,
    userId: number,
    totalPrice: number;
    cartPacks?: ICartPack[];
    cartProducts?: ICartProduct[];
}

export interface ICartPack{
    cartId: number;
    packId: number;
    packQuantity: number;

    pack?: IPack;
}

export interface ICartProduct{
    cartId: number;
    productId: number;
    productQuantity: number;

    product?: IProduct;
}