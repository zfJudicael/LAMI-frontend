<template>
    <div class="refundPage">
        <BackButton />
        <h3>Liste des remboursements</h3>
        <table class="refund_table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Date de remboursement</th>
                    <th>Raison</th>
                    <th>Ref(Transaction)</th>
                    <th>Montant remboursé</th>
                    <th>Numéro de la commande</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="refund in refundList">
                    <td>{{ refund.id }}</td>
                    <td>{{ formatDate(refund.refund_date) }}</td>
                    <td>{{ refund.reason }}</td>
                    <td>{{ refund.referenceTransaction }}</td>
                    <td>{{ refund.amountRefunded.toLocaleString('fr-FR') }} Ar</td>
                    <td>{{ refund.orderId }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import BackButton from '@/components/BackButton.vue';
import type { IRefund } from '@/models/Refund';
import { RefundService } from '@/modules/refund/refund.service';
import { format } from 'date-fns';
import { onMounted, ref } from 'vue';

const refundList = ref<IRefund[]>([])
onMounted(async ()=>{
    try {
        refundList.value = await RefundService.getAll()
    } catch (error) {
        console.log(error)
    }
})

const formatDate = (inputDate: Date): string=>{
    return format(inputDate, 'dd/MM/yyyy HH:mm')
}
</script>

<style>
.refund_table{
 text-align: center;
 width: 100%;
}

.refund_table thead tr{
    background-color: #10B981;
}

.refund_table thead tr th, .refund_table tbody tr td{
    padding: 10px;
}

.refund_table tbody tr{
  background-color: white;
}

.refund_table tbody tr:hover{
    background-color: #f0efef;
    cursor: default;
}
</style>