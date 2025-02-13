import type { IProduct } from "./Product"

export interface IPack{
    id?: number,
    namePack: string,
    pricePack: number,
    packProduct?: IPackProduct[],
    isPublished: boolean;
}

export interface IPackProduct{
    packId: number,
    productId: number,
    quantity: number,
    pack?: IPack,
    product?: IProduct
}