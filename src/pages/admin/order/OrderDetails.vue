<template>
    <div class="orderDetails">
        <BackButton />
        <h3 style="text-align: center;">Détails de la commande</h3>
        <div style="display: grid; gap: 5px; grid-template-columns: repeat(2, 1fr);"> 
            <Card>
                <template #content>
                    <p>Numéro de la commande: {{ order?.id }}</p>
                    <Divider />
                    <p>Client : {{ order?.user?.firstname }} {{ order?.user?.name }} (ID: {{ order?.userId }})</p>
                    <p>Contact : +261 {{ order?.user?.phoneNumber }}</p>
                    <p>Email : {{ order?.user?.email }}</p>
                    <Divider />
                    <p>Date de la commande : {{ orderDate }}</p>
                    <p>Date prévu pour la livraison : {{ deliveryDate }}</p>
                    <p>Lieu de livraison : {{ order?.placeOfDelivery }}</p>
                    <p>Montant : {{ order?.amount.toLocaleString('fr-FR') }} Ariary</p>
                </template>
            </Card>
            <div>
                <Card>
                    <template #content>
                        <h4 style="text-align: center; margin-bottom: 0; margin-top: 0;">Paiement</h4>
                        <Divider />
                        <p>Méthode : {{ payment?.method }}</p>
                        <p>Numéro de compte: +261 {{ payment?.accountNumber }}</p>
                        <p>Référence transaction : {{ payment?.referenceTransaction }}</p>
                    </template>
                </Card>
                <Card style="margin-top: 5px;" v-if="refund">
                    <template #content>
                        <h4 style="text-align: center; margin-bottom: 0; margin-top: 0;">Remboursement</h4>
                        <Divider />
                        <p>Référence transaction : {{ refund?.referenceTransaction }}</p>
                        <p>Date : {{ refund?.refund_date }}</p>
                        <p>Raison : </p>
                        <p>{{ refund?.reason }}</p>
                    </template>
                </Card>
            </div>
        </div>
        <Card v-if="productList.length > 0" style="margin-top: 5px;">
            <template #content>
                <h4 style="text-align: center; margin-bottom: 0; margin-top: 0;">Produits achetés</h4>
                <Divider/>
                <table style="width: 100%;">
                    <thead>
                        <tr>
                            <th>Désignation</th>
                            <th></th>
                            <th>Quantité</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="product in productList">
                            <td>+ {{ product.product.name_product }}</td>
                            <td style="text-align: center;"><img :src="product.product.getProfileURL()" width="200px" :alt="`${product.product.name_product}.png`"></td>
                            <td style="text-align: center;">{{ product.quantityOrdered }}</td>
                        </tr>
                    </tbody>
                </table>
            </template>
        </Card>
    </div>
</template>

<script setup lang="ts">
import type { IOrder } from '@/models/Order';
import { OrderService } from '@/modules/order/order.service';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import BackButton from '@/components/BackButton.vue';
import Card from 'primevue/card';
import Divider from 'primevue/divider';
import { format} from 'date-fns';
import type { IPayment } from '@/models/Payment';
import { PaymentService } from '@/modules/payment/payment.service';
import type { IRefund } from '@/models/Refund';
import { RefundService } from '@/modules/refund/refund.service';
import { OrderProductService } from '@/modules/product/orderProduct/orderProduct.service';
import { Product, type IProduct } from '@/models/Product';

const route = useRoute()
const order = ref<IOrder>()
const orderDate = ref()
const deliveryDate = ref()
onMounted(async ()=>{
    await refreshOrder()
    await refreshPayment(order.value?.id as number)
    await refreshRefund(order.value?.id as number)
    await refreshProduct(order.value?.id as number)
})

const refreshOrder = async ()=>{
    try {
        order.value = await OrderService.getOne(+route.params.id)
        if(order.value){
            orderDate.value = formatDate(order.value.order_date)
            deliveryDate.value = formatDate(order.value.delivery_date)
        }
    } catch (error) {
        console.log(error)
    }
}

const payment = ref<IPayment>()
const refreshPayment = async (orderId: number)=>{
    try {
        payment.value = await PaymentService.getOne(orderId)
    } catch (error) {}
}

const refund = ref<IRefund>()
const refreshRefund = async (orderId: number)=>{
    try {
        refund.value = await RefundService.getOne(orderId)
    } catch (error) {}
}

const productList = ref<{
    quantityOrdered: number
    product: Product
}[]>([])
const refreshProduct = async (orderId: number)=>{
    productList.value = []
    try {
        let result = await OrderProductService.getOne(orderId)
        result.map((orderProduct)=>{
            productList.value.push({
                quantityOrdered: orderProduct.quantityOrdered,
                product: new Product(orderProduct.product as IProduct)
            })
        })
        console.log(productList.value)
    } catch (error) {}
}

const formatDate = (inputDate: Date): string=>{
    return format(inputDate, 'dd/MM/yyyy HH:mm')
}
</script>
