<template>
    <Card style=" width: 60%; margin-left: auto; margin-right: auto; min-height: 100px; margin-top: 10px;">
            <template #content>
                <div v-for="order in orderList" style="border-bottom: 1px dotted gray;">
                    <div style="display: flex; justify-content: space-between;">
                        <p style="margin: 0;">Numéro : {{ order.id }}</p>
                        <p :class="{ 
                            paid : (order.paiementStatus == 'PAID'), 
                            refunded: (order.paiementStatus == 'REFUNDED')
                            }" style="margin: 0;">{{ (order.paiementStatus == 'PAID') ? 'Payée' : 'Remboursée' }}</p>
                    </div>
                    <p>Date de la commande : {{ formatDate(order.order_date) }}</p>
                    <p>Montant : {{ order.amount.toLocaleString('fr-FR') }} Ariary</p>
                    <p>Matériels commandés</p>
                    <p v-for="orderProduct in order.orderedProducts">+{{ orderProduct.product?.name_product }} (x{{ orderProduct.quantityOrdered }})</p>
                </div>
            </template>
        </Card>
</template>

<script setup lang="ts">
import type { IOrder } from '@/models/Order';
import { OrderService } from '@/modules/order/order.service';
import { format } from 'date-fns';
import Card from 'primevue/card';
import { onMounted, ref } from 'vue';


const orderList = ref<IOrder[]>([])

onMounted(async ()=>{
    try {
        await refreshOrderList()
    } catch (error) {}
})

const refreshOrderList = async ()=>{
    orderList.value = []
    try {
        orderList.value = (await OrderService.getMyOrders()).data
    } catch (error) {
        console.log(error)
    }
}

const formatDate = (inputDate: Date): string=>{
    return format(inputDate, 'dd/MM/yyyy HH:mm')
}

</script>