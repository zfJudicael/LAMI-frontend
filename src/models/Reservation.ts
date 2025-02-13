export interface IReservation{
    userId: number,
    productId: number,
    quantityReserved: number,
    expiration_date?: Date
}