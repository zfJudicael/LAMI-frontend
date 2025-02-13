<template>
    <div class="order-page">
        <div style="display: flex; margin-top: 10px;">
            <h3 style="margin: 0; text-align: center; flex-grow: 2;">Liste des commandes</h3>
            <div class="input" style="width: 200px; ">
                <DatePicker 
                    name="application_date" 
                    id="application_date"
                    v-model="selectedDate"
                    showIcon fluid iconDisplay="input" dateFormat="dd/mm/yy"
                    @update:model-value="refreshOrderList()"/> 
            </div>
        </div>
        <table style="text-align: center; width: 100%;" class="order_table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Client</th>
                    <th>Date de réalisation</th>
                    <th>Prix du commande</th>
                    <th>Lieu de livraison</th>
                    <th>État de paiement</th>
                    <th>Rembourser</th>
                    <th>Voir détails</th>
                </tr>
            </thead>
            <tbody v-if="orderList.length > 0">
                <tr v-for="order in orderList" :class="order.isSeen ? 'seen' : 'notSeen'">
                    <td>{{ order.id }}</td>
                    <td>{{ order.user?.firstname }} {{ order.user?.name }}</td>
                    <td>{{ formatDate(order.order_date) }}</td>
                    <td>{{ order.amount.toLocaleString('fr-FR') }} Ariary</td>
                    <td>{{ order.placeOfDelivery }}</td>
                    <td>{{ (order.paiementStatus == 'PAID') ? 'Payée' : 'Remboursée'  }}</td>
                    <td>
                        <Button icon="pi pi-undo" size="small" severity="info" rounded v-if="order.paiementStatus == 'PAID'" @click="openRefundDialog(order)"/>
                    </td>
                    <td>
                        <Button icon="pi pi-book" size="small" rounded outlined @click="$router.push({name: 'orderDetails', params: { id: order.id }})"></Button>
                    </td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr>
                    <td colspan="8">Aucun donnée</td>
                </tr>
            </tbody>
        </table>

        <Dialog v-model:visible="showRefundDialog" :closable="false" modal header="Remboursement" :style="{ width: '25rem' }">
            <div>
                <p>Commande concernée : {{ selectedOrder?.id }}</p>
                <p>Montant à rembourser : {{ selectedOrder?.amount }} Ariary</p>
            </div>
            <form>
                <div class="input" style="display: flex; flex-direction: column;">
                    <label for="reason">Raison du remboursement</label>
                    <Textarea v-model="reason" name="reason" id="reason"></Textarea>
                </div>

                <div style="margin-top: 10px; display: flex; gap: 5px;">
                    <Button label="Confirmer" style="flex-grow: 2;" @click="confirmRefund"/>
                    <Button label="Annuler" severity="secondary" outlined style="flex-grow: 1;" @click="closeRefundModal"/>
                </div>
            </form>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';
import DatePicker from 'primevue/datepicker';
import { useToast } from 'primevue/usetoast';
import type { IOrder } from '@/models/Order';
import { OrderService } from '@/modules/order/order.service';
import { format } from 'date-fns';
import { onMounted, ref } from 'vue';
import { RefundService } from '@/modules/refund/refund.service';

const orderList = ref<IOrder[]>([])
const showRefundDialog = ref<boolean>(false)
const selectedOrder = ref<IOrder>()
const toast = useToast()

const selectedDate = ref<Date>(new Date())

onMounted(async ()=>{
    try {
        await refreshOrderList()
    } catch (error) {
        console.log(error)
    }
})

const refreshOrderList = async ()=>{
    orderList.value = []
    try {
        orderList.value = await OrderService.getAll(format(selectedDate.value, 'dd:MM:yyyy'))
    } catch (error) {
        throw new Error()
    }finally{
        console.log(orderList.value)
    }
}

const reason = ref<string>('')

const openRefundDialog = (order: IOrder)=>{
    selectedOrder.value = order
    showRefundDialog.value = true
}

const closeRefundModal = ()=>{
    showRefundDialog.value = false
}

const confirmRefund = async ()=>{
    try {
        await RefundService.create({
            amountRefunded: selectedOrder.value?.amount as number,
            reason: reason.value,
            orderId: selectedOrder.value?.id as number,
            userId: selectedOrder.value?.userId as number,
        })
        closeRefundModal()
        await refreshOrderList()
        toast.add({ severity: 'success', summary: 'Commande remboursée avec succès', life: 3000 })
    } catch (error) {
        console.log(error)
        toast.add({ severity: 'error', summary: 'Echec', detail: 'Veuillez réessayer', life: 3000 })
    }
}

const formatDate = (inputDate: Date): string=>{
    return format(inputDate, 'dd/MM/yyyy HH:mm')
}
</script>

<style>
.order_table{
 text-align: center;
 width: 100%;
}

.order_table thead tr{
    background-color: #10B981;
}

.order_table thead tr th, .order_table tbody tr td{
    padding: 10px;
}

.order_table tbody tr:hover{
    background-color: #c5bfbf;
    cursor: default;
}

.seen{
    background-color: white;
}

.notSeen{
    background-color: #f0efef;
}
</style>