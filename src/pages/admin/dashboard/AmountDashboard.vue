<template>
    <Card class="amoutDashboard" style="margin-bottom: 5px; margin-top: 10px;">
        <template #content >
            <h3 style="margin: 0; text-align: center;">Montant en crédit et en débit </h3>
            <div style="display: flex; gap: 10px; justify-content: end;">
                <div style="
                    background-color: #6DF7C8;
                    padding: 20px;
                    border-radius: 10px;">
                    {{ totalOrderAmout.toLocaleString('fr-FR') }} Ariary
                </div>
                <div style="
                    background-color: #DC2626;
                    color: white;
                    padding: 20px;
                    border-radius: 10px;
                    ">
                    {{ totalRefundAmount.toLocaleString('fr-FR') }} Ariary
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { OrderService } from '@/modules/order/order.service';
import { RefundService } from '@/modules/refund/refund.service';
import Card from 'primevue/card';
import { onMounted, ref } from 'vue';

const totalOrderAmout = ref<number>(0)
const totalRefundAmount = ref<number>(0)
onMounted(async ()=>{
    try {
        totalOrderAmout.value = (await OrderService.getCurrentMonthOrderTotal()).totalAmount
        totalRefundAmount.value = (await RefundService.getCurrentMonthRefundTotal()).totalAmount
    } catch (error) {
        console.log(error)
    }
})
</script>