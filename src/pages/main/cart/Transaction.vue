<template>
    <Card style=" width: 60%; margin-left: auto; margin-right: auto; min-height: 100px; margin-top: 10px;">  
        <template #content>
            <div>
                <h4 style="text-align: center;">Paiements</h4>
                <div v-for="payment in paymentList" style="border-top: 1px dotted gray;">
                    <p>Réference de la transaction : {{ payment.referenceTransaction }}</p>
                    <p>Date de paiement : {{ formatDate(payment.payment_date) }}</p>
                    <p>Montant payé : {{ payment.amountPaid.toLocaleString('fr-FR') }} Ariary</p>
                    <p>Pour la commande numéro : {{ payment.orderId }}</p>
                </div>
            </div>
            <Divider />
            <div style="margin-top: 10px;">
                <h4 style="text-align: center;">Remboursements</h4>
                <div v-for="refund in refundList" style="border-top: 1px dotted gray;">
                    <p>Réference de la transaction : {{ refund.referenceTransaction }}</p>
                    <p>Date de remboursement : {{ refund.refund_date }}</p>
                    <p>Montant remboursé : {{ refund.amountRefunded.toLocaleString('fr-FR') }} Ariary</p>
                    <p>Pour la commande numéro : {{ refund.orderId }}</p>
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card';
import Divider from 'primevue/divider';
import { format } from 'date-fns';
import type { IPayment } from '@/models/Payment';
import { onMounted, ref } from 'vue';
import type { IRefund } from '@/models/Refund';
import { PaymentService } from '@/modules/payment/payment.service';
import { RefundService } from '@/modules/refund/refund.service';


const paymentList = ref<IPayment[]>([])
const refundList = ref<IRefund[]>([])

onMounted(async ()=>{
    try {
        await refreshPaymentList()
        await refreshRefundList()
    } catch (error) {
        
    }
})

const refreshPaymentList = async ()=>{
    paymentList.value = []
    try {
        paymentList.value = await PaymentService.getMyPayment()
    } catch (error) {
        console.log(error)
    }
}

const refreshRefundList = async ()=>{
    refundList.value = []
    try {
        refundList.value = await RefundService.getMyRefund()
    } catch (error) {
        console.log(error)
    }
}

const formatDate = (inputDate: Date): string=>{
    return format(inputDate, 'dd/MM/yyyy HH:mm')
}
</script>

