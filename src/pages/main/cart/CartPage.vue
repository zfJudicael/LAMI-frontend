<template>
    <div class="cart">

        <div style="display: flex; justify-content: center;">
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); text-align: center;">
                <p @click="switchToCart" class="switchBTN" :class="{activeBTN : showCart}">Mon panier</p>
                <p @click="switchToOrder" class="switchBTN" :class="{activeBTN : showOrder}">Mes commandes</p>
                <p @click="switchToTransaction" class="switchBTN" :class="{activeBTN : showTransaction}">Mes transactions</p>
            </div>
        </div>
        <Card v-if="showCart" style=" width: 60%; margin-left: auto; margin-right: auto; min-height: 100px; margin-top: 10px;">
            <template #content>
                <div v-if="!cartStore.myCart?.cartPacks && !cartStore.myCart?.cartProducts" style=" display: flex; align-items: center; justify-content: center;">
                    <i class="pi pi-times"></i>
                    <p>Aucune article ajoutée</p>
                </div>
                <div v-if="cartStore.myCart?.cartProducts">
                    <div style="display: grid; grid-template-columns: repeat(8, 1fr); border-bottom: 1px solid gray;">
                        <p style="grid-column: 1/5;">Désignation</p>
                        <p style="text-align: center;">Prix</p>
                        <p style="text-align: center;">Quantité</p>
                        <p style="text-align: center;">Sous-total</p>
                        <p style="text-align: center;">Supprimer</p>
                    </div>
                    <div v-for="cartProduct in cartStore.getCartProducts" style="display: grid; grid-template-columns: repeat(8, 1fr); border-bottom: 1px dotted gray;">
                        <p style="grid-column: 1/5; font-weight: bold;" class="designationBTN" @click="$router.push({name: 'productDetailsClient', params: {id: cartProduct.product.id}})">{{ cartProduct.product.name_product }}</p>
                        <p style="text-align: center;">{{ cartProduct.product.getPrice().toLocaleString('fr-FR') }} Ar</p>
                        <p style="display: flex; flex-direction: column; align-items: center;">
                            {{ cartProduct.productQuantity }}
                            <i class="pi pi-pen-to-square editBTN" @click="openEditProductQuantityDialog(cartProduct)"></i>
                        </p>
                        <p style="text-align: center;">{{ (cartProduct.productQuantity * cartProduct.product.getPrice()).toLocaleString('fr-FR') }} Ar</p>
                        <p style="text-align: center;">
                            <i class="pi pi-times deleteBTN" @click="removeCartProduct(cartProduct.product.id as number)"></i>
                        </p>
                    </div>

                    <div v-for="cartPack in cartStore.getCartPacks" style="display: grid; grid-template-columns: repeat(8, 1fr); border-bottom: 1px dotted gray;">
                        <p style="grid-column: 1/5; font-weight: bold;" class="designationBTN">{{ cartPack.pack?.namePack }}</p>
                        <p style="text-align: center;">{{ cartPack.pack?.pricePack.toLocaleString('fr-FR') }} Ar</p>
                        <p style="display: flex; flex-direction: column; align-items: center;">
                            {{ cartPack.packQuantity }}
                            <i class="pi pi-pen-to-square editBTN" @click="openEditPackQuantityDialog(cartPack)"></i>
                        </p>
                        <p style="text-align: center;">{{ (cartPack.packQuantity * cartPack.pack?.pricePack!).toLocaleString('fr-FR') }} Ar</p>
                        <p style="text-align: center;">
                            <i class="pi pi-times deleteBTN" @click="removeCartPack(cartPack.pack?.id as number)"></i>
                        </p>
                    </div>
                </div>
                <div>
                    <p style="font-weight: bolder;">Prix total: {{ cartStore.myCart?.totalPrice.toLocaleString('fr-FR') }} Ariary</p>

                    <div v-if="showErrorMessage"
                    style="background-color: red; color:  white; width: 80%; margin-bottom: 5px; margin-left: auto; margin-right: auto; text-align: center; border-radius: 5px;"
                    >
                        <pre style="white-space: pre-wrap; word-wrap: break-word; font-family: inherit; margin: 0;">{{ errorMessage }}</pre>
                    </div>

                    <div style="display: flex; justify-content: center; gap: 5px;">
                        <Button label="Passer la commande" size="small" icon="pi pi-wallet" @click="order()" :disabled="cartStore.getLength == 0 ? true: false"/>
                        <Button label="Vider le panier" size="small" severity="danger" icon="pi pi-trash" outlined @click="clearCart()" :disabled="cartStore.getLength == 0 ? true: false"></Button>
                    </div>
                </div>
            </template>
        </Card>

        <OrderComponent v-if="showOrder"/>

        <TransactionComponent v-if="showTransaction"/>

        <Dialog v-model:visible="showEditProductQuantityDialog"
            modal 
            :header="`Modification de la quantité de l'article: ${selectedCartProduct?.product.name_product}`" 
            :draggable="false" 
            :style="{ width: '25rem' }"
            >
            <form class="editproductQuantity">
                <label for="quantity-input">Quantité</label>
                <InputNumber v-model="productQuantity" inputId="quantity-input" fluid :showButtons="true" button-layout="horizontal" :step="1" :max="selectedCartProduct?.product.availableQuantity" :min="1">
                    <template #incrementbuttonicon>
                        <span class="pi pi-plus" />
                    </template>
                    <template #decrementbuttonicon>
                        <span class="pi pi-minus" />
                    </template>
                </InputNumber>
                <div  class="BTN">
                    <Button type="button" label="Confirmer" class="btn1" @click="submitEditProductQuantity"></Button>
                    <Button type="button" label="Annuler" severity="secondary" @click="showEditProductQuantityDialog = false"></Button>
                </div>
            </form>
        </Dialog>

        <Dialog v-model:visible="showEditPackQuantityDialog"
            modal 
            :header="`Modification de la quantité de l'article: ${selectedCartPack?.pack?.namePack}`" 
            :draggable="false" 
            :style="{ width: '25rem' }"
            >
            <form class="editproductQuantity">
                <label for="quantity-input">Quantité</label>
                <InputNumber v-model="packQuantity" inputId="quantity-input" fluid :showButtons="true" button-layout="horizontal" :step="1" :max="5" :min="1">
                    <template #incrementbuttonicon>
                        <span class="pi pi-plus" />
                    </template>
                    <template #decrementbuttonicon>
                        <span class="pi pi-minus" />
                    </template>
                </InputNumber>
                <div  class="BTN">
                    <Button type="button" label="Confirmer" class="btn1" @click="submitEditPackQuantity"></Button>
                    <Button type="button" label="Annuler" severity="secondary" @click="showEditPackQuantityDialog = false"></Button>
                </div>
            </form>
        </Dialog>

        <ConfirmDialog :closable="false" />
       
        <Dialog v-model:visible="showPayment" :closable="false" modal header="Commande" :style="{ width: '30rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            
            <div>
                <p>Montant à payer : {{ cartStore.myCart?.totalPrice.toLocaleString('fr-FR') }} Ariary</p>
            </div>
            <Divider />
            <form class="orderForm">

                <div class="input">
                    <label for="method">Méthode de paiement</label>
                    <div style="display: flex; justify-content: center;">

                        <div v-for="methode in methodes" style="display: flex; align-items: center;">
                            <RadioButton v-model="paymentMethod" :inputId="methode.methodeName" :value="methode.methodeName"/>
                            <img :src="methode.src" width="100px" height="60px" :alt="`${methode.methodeName}.png`">
                        </div>

                    </div>
                </div>

                <div class="input">
                <label for="accountNumber">Numéro de compte*</label>
                <InputGroup>
                    <InputGroupAddon>+261</InputGroupAddon>
                    <InputNumber v-model="accountNumber" id="accountNumber" aria-labelledby="accountNumber" :use-grouping="false" :invalid="errors.accountNumber ? true : false"/>
                </InputGroup>
                <small class="errorMessage" >{{ errors.accountNumber }}</small>
            </div>

            <div class="input">
                <label for="placeOfDelivery">Adresse de livraison*</label>
                <InputText v-model="placeOfDelivery" name="placeOfDelivery" id="placeOfDelivery" :invalid="errors.placeOfDelivery ? true : false"/> 
                <small class="errorMessage" >{{ errors.placeOfDelivery }}</small>
            </div>

            <Divider />

            <div style="margin-top: 10px; display: flex; gap: 5px;">
                <Button label="Confirmer" style="flex-grow: 2;" @click="confirmPayment"/>
                <Button label="Annuler" severity="secondary" outlined style="flex-grow: 1;" @click="closePaymentModal"/>
            </div>

            </form>
        </Dialog>
    </div>    
</template>

<script setup lang="ts">
import Card from 'primevue/card';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import RadioButton from 'primevue/radiobutton';
import Divider from 'primevue/divider';
import { useCartStore } from '@/stores/cart.store';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import { defineAsyncComponent, ref } from 'vue';
import type { Product } from '@/models/Product';
import type { ICartPack } from '@/models/Cart';
import { ReservationService } from '@/modules/reservation/reservation.service';
import { methodes } from '@/models/Payment';
import { toTypedSchema } from '@vee-validate/yup';
import { number, object, string } from 'yup';
import { useField, useForm } from 'vee-validate';
import { OrderService } from '@/modules/order/order.service';

const TransactionComponent = defineAsyncComponent(()=> import('./Transaction.vue'))
const OrderComponent = defineAsyncComponent(()=> import('./Order.vue'))


const showCart = ref<boolean>(true)
const showOrder = ref<boolean>(false)
const showTransaction = ref<boolean>(false)

const switchToCart = ()=>{
    if(!showCart.value){
        showCart.value = true
        showOrder.value = false
        showTransaction.value = false
    }
}

const switchToOrder = ()=>{
    if(!showOrder.value){
        showCart.value = false
        showOrder.value = true
        showTransaction.value = false
    }
}

const switchToTransaction = ()=>{
    if(!showTransaction.value){
        showCart.value = false
        showOrder.value = false
        showTransaction.value = true
    }
}

const toast = useToast()
const showPayment = ref<boolean>(false)

const cartStore = useCartStore()

const removeCartProduct = async (productId: number)=>{
    try {
        await cartStore.removeCartProduct(productId)
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Echec', detail: 'Veuillez réessayer', life: 3000 })
    }
}

const removeCartPack = async (packId: number)=>{
    try {
        await cartStore.removeCartPack(packId)
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Echec', detail: 'Veuillez réessayer', life: 3000 })
    }
}

interface ICartProductFull {
  productQuantity: number,
  product: Product
}

const showEditProductQuantityDialog = ref<boolean>(false)
const selectedCartProduct = ref<ICartProductFull>()
const productQuantity = ref<number>(0)
const openEditProductQuantityDialog = (cartProduct: ICartProductFull)=>{
    selectedCartProduct.value = cartProduct
    productQuantity.value = selectedCartProduct.value.productQuantity
    showEditProductQuantityDialog.value = true
}

const submitEditProductQuantity = async ()=>{
    try {
        await cartStore.updateProductQuantity(selectedCartProduct.value?.product.id as number, productQuantity.value)
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Echec de la modification', detail: 'Veuillez réessayer', life: 3000 })
    } finally {
        showEditProductQuantityDialog.value = false
    }
}


const showEditPackQuantityDialog = ref<boolean>(false)
const selectedCartPack = ref<ICartPack>()
const packQuantity = ref<number>(0)
const openEditPackQuantityDialog = (cartPack: ICartPack)=>{
    selectedCartPack.value = cartPack
    packQuantity.value = selectedCartPack.value.packQuantity
    showEditPackQuantityDialog.value = true
}

const submitEditPackQuantity = async ()=>{
    try {
        await cartStore.updatePackQuantity(selectedCartPack.value?.pack?.id as number, packQuantity.value)
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Echec de la modification', detail: 'Veuillez réessayer', life: 3000 })
    } finally {
        showEditPackQuantityDialog.value = false
    }
}

const confirm = useConfirm()
const clearCart = () => {
    confirm.require({
        message: 'Êtes vous sûr d\'y procéder?',
        header: 'Confirmation',
        icon: 'pi pi-info-circle',
        rejectProps: {
            label: 'Annluer',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Sauvegarder',
            severity: 'danger'
        },
        accept: () => {
            cartStore.clearCart()
                .then(()=>{})
                .catch(()=>{
                    toast.add({ severity: 'error', summary: 'Échec de la suppression', life: 3000 });
                })
        },
        reject: () => {}
    });
};

const showErrorMessage = ref<boolean>(false)
const errorMessage = ref<string>('')

const order = async ()=>{
    try {
        await cartStore.validateCart()
        showErrorMessage.value = false


        confirm.require({
            message: 'Voulez vous finalisez la commande?',
            header: 'Confirmation',
            icon: 'pi pi-info-circle',
            rejectProps: {
                label: 'Annuler',
                severity: 'secondary',
                outlined: true
            },
            acceptProps: {
                label: 'Confirmer',
                severity: 'success'
            },
        accept: () => {
            showPayment.value = true
        },
        reject: async () => {
            await ReservationService.clearReservation()
        }
    });


    } catch (error: any) {
        showErrorMessage.value = true
        const [errorCode, id] = error.response.data.message.split('||')

        if(errorCode === 'PRODUCT_OUT_OF_STOCK') {
            let product = cartStore.getProduct(id as number)
            errorMessage.value = `
                Le stock de ${product[0].product.name_product} est insuffisant. \n
                La quantité demandée ne doit pas depasser ${product[0].product.availableQuantity}
            `
        }else if(errorCode === 'PACK_OUT_OF_STOCK'){
            let pack = cartStore.getPack(id as number)
            errorMessage.value = `
                Le stock de ${pack[0].pack?.namePack} est insuffisant.
            `
        }else{
            errorMessage.value = 'Erreur du serveur, veuillez réesayer'
        }
    }
}

const closePaymentModal = async ()=>{
    try {
        await ReservationService.clearReservation()
        showPayment.value = false
        handleReset()
    } catch (error) {}
}

const paymentMethod = ref<string>(methodes[0].methodeName)
const validationSchema = toTypedSchema(
    object({
        accountNumber: number()
                        .required("Veuillez remplir ce champ")
                        .test('len', 'Le numéro de téléphone doit comporter 9 chiffres', val => val.toString().length === 9),
        placeOfDelivery: string()
                    .required("Le nom est obligatoire"),
    })
)

const { handleSubmit, handleReset,errors } = useForm({ 
    validationSchema,
});

const { value: accountNumber } = useField('accountNumber');
const { value: placeOfDelivery } = useField('placeOfDelivery');

const confirmPayment = handleSubmit(async (values)=>{
    try {
        await OrderService.create({
            accountNumber: values.accountNumber.toString(),
            amount: cartStore.myCart?.totalPrice as number,
            method: paymentMethod.value,
            placeOfDelivery: values.placeOfDelivery,
            cartId: cartStore.myCart?.id as number
        })
        showPayment.value = false
        await cartStore.refreshMyCart()
        toast.add({ severity: 'success', summary: 'Commande effectuée', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Commande échouée, veuillez réesayer', life: 3000 });
    }
})


</script>

<style>
.designationBTN:hover{
    cursor: pointer;
}

.deleteBTN:hover{
    color: red;
    cursor: pointer;
}

.editBTN:hover{
    color: blue;
    cursor: pointer;
}

.editproductQuantity .BTN, .changeProfilePicture .BTN{
    margin-top: 20px;
    display: flex;
    gap: 10px;
}

.editproductQuantity .BTN .btn1{
    flex-grow: 2;
}

.orderForm .input{
    display: flex;
    flex-direction: column;
    margin-top: 10px;
}

.orderForm .input .errorMessage{
    color: red;
}

.activeBTN{
    background-color: #10B981;
    color: white;
}
.switchBTN{
    border: 1px solid gray; 
    margin: 0; 
    padding: 6px;
}

.switchBTN:hover{
    cursor: pointer;
}

.paid{
    color: green;
}

.refunded{
    color: red;
}
</style>