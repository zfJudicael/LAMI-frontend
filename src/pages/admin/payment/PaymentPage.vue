<template>
    <div class="payment-page">
        <Button label="Voir la liste des remboursements" icon="pi pi-arrow-right" size="small" rounded icon-pos="right" @click="$router.push({name: 'refundPage'})"/>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                <h3 style="text-align: center; margin: 0; flex-grow: 2;">Liste des paiement effectué par les clients</h3>
                <DatePicker 
                        name="application_date" 
                        id="application_date"
                        v-model="selectedDate"
                        showIcon fluid iconDisplay="input" dateFormat="dd/mm/yy"
                        @update:model-value="refreshPaymentList()"/> 
        </div>
        <table style="width: 100%; text-align: center;" class="payment_table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Identifiant de l'utilisation</th>
                    <th>Méthode de paiement</th>
                    <th>Date de paiement</th>
                    <th>Numéro de compte</th>
                    <th>Montant payé</th>
                    <th>Ref(transaction)</th>
                    <th>Numéro de la commande</th>
                </tr>
            </thead>
            <tbody v-if="paymentList.length > 0">
                <tr v-for="payment in paymentList">
                    <td>{{ payment.id }}</td>
                    <td>{{ payment.userId }}</td>
                    <td>{{ handlePaymentMethod(payment.method) }}</td>
                    <td>{{ formatDate(payment.payment_date) }}</td>
                    <td>+261 {{ payment.accountNumber }}</td>
                    <td>{{ payment.amountPaid.toLocaleString('fr-FR') }} Ariary</td>
                    <td>{{ payment.referenceTransaction }}</td>
                    <td>{{ payment.orderId }}</td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr>
                    <td colspan="8">Aucun donnée</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import DatePicker from 'primevue/datepicker';
import { methodes, type IPayment } from '@/models/Payment';
import { PaymentService } from '@/modules/payment/payment.service';
import { format } from 'date-fns';
import { onMounted, ref } from 'vue';

const selectedDate = ref<Date>(new Date())
const paymentList = ref<IPayment[]>([])
onMounted(async ()=>{
    try {
        await refreshPaymentList()
    } catch (error) {
        console.log(error)
    }
})

const refreshPaymentList = async ()=>{
    try {
        paymentList.value = await PaymentService.getAll(format(selectedDate.value, 'dd:MM:yyyy'))
    } catch (error) {
        throw new Error()
    }
}

const formatDate = (inputDate: Date): string=>{
    return format(inputDate, 'dd/MM/yyyy HH:mm')
}

const handlePaymentMethod = (method: string)=>{
    if(method == methodes[0].methodeName) return 'MVola'
    else if(method == methodes[1].methodeName) return 'OrangeMoney'
    else if(method == methodes[2].methodeName) return 'AirtelMoney'
}

// const teachers = [
//     {
//         name : "Service",
//         page: 400
// }
// , {
//     name: "Back",
//     page: 200
// }];

// for (const newMan of teachers){
//     console.log(newMan.name)
// }


</script>

<style>
.payment_table{
 text-align: center;
 width: 100%;
}

.payment_table thead tr{
    background-color: #10B981;
}

.payment_table thead tr th, .payment_table tbody tr td{
    padding: 10px;
}

.payment_table tbody tr{
  background-color: white;
}

.payment_table tbody tr:hover{
    background-color: #f0efef;
    cursor: default;
}
</style>