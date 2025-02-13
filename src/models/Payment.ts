export const methodes = [
    {
        methodeName: 'MVOLA',
        src: '/src/assets/img/mvola.png'
    },
    {
        methodeName: 'ORANGEMONEY',
        src: '/src/assets/img/orange.png'
    },
    {
        methodeName: 'AIRTELMONEY',
        src: '/src//assets/img/airtel.png'
    }
]

export interface IPayment{
    id: number;
    userId: number;
    payment_date: Date;
    method: string;
    accountNumber: string;
    amountPaid: number;
    referenceTransaction: string;
    orderId: number
}

export interface IPaymentMethodCount{
    method: string,
    count: number
}
