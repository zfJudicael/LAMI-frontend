<template>
    <div class="product_details">
        <BackButton />
        <div style="display: grid; grid-template-columns: repeat(6, 1fr); padding: 5px;">
            <div class="photos" style="grid-column: 1/3;">
                <div style="display: flex; justify-content: center;">
                    <img :src="product?.getProfileURL()" :alt="`${product?.name_product}.png`" width="300px">
                </div>
                <Carousel 
                    class="otherPhotos"
                    :value="product?.getOtherPicturesURL()" 
                    :num-visible="1" 
                    style="display: flex; justify-content: center;">
                    <template #item="slotProps">
                        <div>
                            <img :src="slotProps.data" alt="otherPics.png" width="200px" style="margin-left: auto; margin-right: auto;">
                        </div>
                    </template>
                </Carousel>
            </div>
            <div class="informations" style="grid-column: 3/6;">
                <h2 style="text-align: center;">{{ product?.name_product }}</h2>
                <pre style="white-space: pre-wrap; word-wrap: break-word; font-family: inherit;">{{ product?.description }}</pre>
                <h3>Information</h3>
                <p>Marque : {{  product?.brand }}</p>
                <p v-if="product?.color">Couleur disponible : {{ product?.color }}</p>
                <p>Prix unitaire : {{ product?.price.toLocaleString('fr-FR') }} Ariary</p>
                <p>Quantité disponible : {{ product?.availableQuantity }}</p>
                <h3>Spécification technique</h3>
                <pre style="white-space: pre-wrap; word-wrap: break-word; font-family: inherit;">{{ product?.technicalSpecification }}</pre>
            </div>
            <div class="order" style="grid-column: 6/7; display: flex; justify-content: center;">
                <form @submit.prevent="" style="display: flex; flex-direction: column; justify-content: center; gap: 5px; text-align: center">
                    <div>
                        <label for="quantity-input">Quantité à commander</label>
                        <InputNumber v-model="quantity" inputId="quantity-input" fluid :showButtons="true" button-layout="horizontal" :step="1" :max="product?.availableQuantity" :min="0">
                            <template #incrementbuttonicon>
                                <span class="pi pi-plus" />
                            </template>
                            <template #decrementbuttonicon>
                                <span class="pi pi-minus" />
                            </template>
                        </InputNumber>
                    </div>
                    <Button type="submit" :disabled="quantity === 0" @click="addToCart">Ajouter au panier</Button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import BackButton from '@/components/BackButton.vue';
import { Product } from '@/models/Product';
import { ProductService } from '@/modules/product/product.service';
import Button from 'primevue/button';
import Carousel from 'primevue/carousel';
import InputNumber from 'primevue/inputnumber';
import { useToast } from 'primevue/usetoast';
import { useCartStore } from '@/stores/cart.store';
import { useAuthStore } from '@/stores/auth.store';

const toast = useToast()

const route = useRoute()
const product = ref<Product>()
onMounted(async ()=>{
    try {
        product.value = new Product(await ProductService.getOne(+route.params.id))
    } catch (error) {}
})

const quantity = ref(0)

const addToCart = ()=>{
    if(useAuthStore().getUser){
        useCartStore().addCartProduct({
            productId: product.value?.id as number,
            productQuantity: quantity.value
        })
        .then(()=> {
            toast.add({ severity: 'success', summary: 'Succès', detail: 'Le matériel est ajouté au panier', life: 3000 })
            quantity.value = 0 
        })
        .catch(()=>{
            toast.add({ severity: 'error', summary: 'Echec', detail: 'Le matériel n\'est pas ajouté au panier', life: 3000 })
        })
    }else{
        toast.add({ severity: 'info', summary: 'Action rejetée', detail: 'Veuillez vous connecter à votre compte', life: 3000 })
    }
}
</script>