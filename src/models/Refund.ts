export interface IRefund {
    id: number;
    refund_date: Date;
    amountRefunded: number;
    reason: string;
    referenceTransaction: string;
    orderId: number;
    userId: number;
}