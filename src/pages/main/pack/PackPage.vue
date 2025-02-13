<template>
    <div class="pack">
        <template v-if="loadingPackList">
            <Card v-for="i in 2" class="pack-item">
                <template #content>
                    <div style="display: grid; grid-template-columns: repeat(6, 1fr);">
                        
                        <div style="grid-column: 1/6;">
                            <Skeleton width="280px" height="40px"/>
                            <Skeleton width="200px" height="25px" style="margin-top: 15px;"/>
                            <div style="margin-top: 10px;display: flex; align-items: center; justify-content: center; flex-wrap: wrap;">
                                <div v-for="i in 3" style="display: flex;">
                                    <p v-if="i !== 1" style="color: #0284C7; display: flex; align-items: center;">
                                        <i class="pi pi-plus"></i>
                                    </p>
                                    <div style="position: relative;">
                                        <Skeleton width="300px" height="200px"/>
                                        <Skeleton height="20px" style="margin-top: 16px;"/>
                                    </div>
                                </div>
                            </div>
                        </div>
        
                    <div class="order" style="grid-column: 6/7; display: flex; justify-content: center; flex-direction: column;">
                            <Skeleton width="100%" style="margin-bottom: 2px;"/>
                            <Skeleton width="100%" height="36px"/>
                            <Skeleton width="100%" height="36px" style="margin-top: 5px;"/>
                    </div>
                    </div>
                </template>
            </Card>
        </template>

        <template v-else>
            <template v-if="packList.length > 0">
                <Card v-for="(pack, packIndex) in packList" class="pack-item">
                    <template #content>
                        <div style="display: grid; grid-template-columns: repeat(6, 1fr);">
                            
                            <div style="grid-column: 1/6;">
                                <h1>{{ pack.namePack }}</h1>
                                <p style="font-weight:bolder; font-size: larger;">Prix: {{ pack.pricePack.toLocaleString('fr-FR') }} Ar</p>
                                <div style="display: flex; align-items: center; justify-content: center; flex-wrap: wrap;">
                                    <div v-for="(packProduct, index) in pack.product" style="display: flex;">
                                        <p v-if="index !== 0" style="color: #0284C7; display: flex; align-items: center;"><i class="pi pi-plus"></i></p>
                                        <div style="position: relative;">
                                            <img :src="packProduct.product.getProfileURL()" :alt="`${packProduct.product.name_product}.png`" style="max-width: 300px;">
                                            <p style="
                                                color: white;
                                                background-color: #0284C7;
                                                position: absolute; 
                                                padding: 5px;
                                                top: 0; 
                                                right: 0;
                                                font-size: larger;
                                                border-radius: 20px; 
                                                z-index: 3;">X {{ packProduct.quantity }}</p>
                                            <p style="text-align: center;" @click="$router.push({name: 'productDetailsClient', params: {id: packProduct.product.id}})" class="nameProduct">{{ packProduct.product.name_product }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
            
                            <div class="order" style="grid-column: 6/7; display: flex; justify-content: center;">
                            <form @submit.prevent="" style="display: flex; flex-direction: column; justify-content: center; gap: 5px; text-align: center">
                                <div>
                                    <label for="quantity-input">Quantité à commander</label>
                                    <InputNumber inputId="quantity-input" v-model="quantityAsked[packIndex]" fluid :showButtons="true" button-layout="horizontal" :step="1" :max="5" :min="1">
                                        <template #incrementbuttonicon>
                                            <span class="pi pi-plus" />
                                        </template>
                                        <template #decrementbuttonicon>
                                            <span class="pi pi-minus" />
                                        </template>
                                    </InputNumber>
                                </div>
                                <Button :disabled="(quantityAsked[packIndex] == 0) ? true : false " 
                                    @click="addToCart(pack.id as number, packIndex)">Ajouter au panier</Button>
                            </form>
                        </div>
                        </div>
                    </template>
                </Card>
            </template>
            <div v-else>
                <p>Aucun pack disponible pour le moment</p>
                <p>N'hesites pas à consulter régulièrement cette page pour ne pas en rater.</p>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Product } from '@/models/Product';
import type { IPack } from '@/models/Pack';
import { PackService } from '@/modules/pack/pack.service';
import { useCartStore } from '@/stores/cart.store';
import Card from 'primevue/card';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/stores/auth.store';
import Skeleton from 'primevue/skeleton';


const loadingPackList = ref<boolean>(false)

interface IProductPack {
    quantity: number,
    product: Product
}

interface IPackFull extends IPack{
    product: IProductPack[]
}

const packList = ref<IPackFull[]>([])
onMounted(()=>{
    refreshPackList()
})

const quantityAsked = ref<number[]>([])
const refreshPackList = ()=>{
    loadingPackList.value = true
    packList.value = []
    PackService.getPublishedPack()
        .then((res)=>{

            res.forEach((pack)=>{
                let productList: IProductPack[] = []
                pack.packProduct?.forEach((packProduct)=>{
                    if(packProduct.product) productList.push({
                        quantity: packProduct.quantity,
                        product: new Product(packProduct.product)
                    })
                })

                packList.value.push({
                    id: pack.id as number,
                    namePack: pack.namePack,
                    pricePack: pack.pricePack,
                    isPublished: pack.isPublished,
                    product: productList
                })
            })

        })
        .catch((err)=>{})
        .finally(()=>{
            packList.value.forEach(()=>{ quantityAsked.value.push(0) })
            loadingPackList.value = false
        })
}

const toast = useToast()
const addToCart = (packId: number, index: number)=>{
    if(useAuthStore().getUser){
        useCartStore().addCartPack({
            packId,
            packQuantity: quantityAsked.value[index]
        })
        .then(()=> {
            toast.add({ severity: 'success', summary: 'Succès', detail: 'L\'article est ajouté au panier', life: 3000 })
            quantityAsked.value[index] = 0
        })
        .catch(()=>{
            toast.add({ severity: 'error', summary: 'Echec', detail: 'L\'article n\'est pas ajouté au panier', life: 3000 })
        })
    }else{
        toast.add({ severity: 'info', summary: 'Action rejetée', detail: 'Veuillez vous connecter à votre compte', life: 3000 })
    }

    
}
</script>

<style>
.pack-item{
    background-color: white; 
    cursor: pointer;
    margin: 10px;
}

.pack-item:hover{
    box-shadow: 1px 1px 5px grey;
}

.nameProduct:hover{
    text-decoration: underline;
}
</style>