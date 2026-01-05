<template>
    <Card class="product-item" @click="$router.push({name: 'productDetailsClient', params: { id: product.id }})">
        <template #title>
            <p class="name_product">{{ product.name_product }}</p>
        </template>
        <template #subtitle></template>
        <template #content>
            <div class="thumbnail">
                <p v-if="product.promotionProducts?.length" class="promo">Promo</p>
                
                <img class="img" :src="product.getProfileURL()" :alt="`${product.name_product}.png`">
                
                <s v-if="product.promotionProducts?.length" class="original_price">{{ product.price.toLocaleString() }} Ariary</s>
                <p class="price">{{ product.getPrice().toLocaleString('fr-FR') }} Ariary</p>
            </div>
        </template>
        <template #footer></template>
    </Card>
</template>

<script setup lang="ts">
import type { Product } from '@/models/Product';
import Card from 'primevue/card';

defineProps<{
    product: Product
}>()
</script>

<style lang="scss">
.product-item{
    background-color: white; 
    cursor: pointer;
    
    &:hover{
        box-shadow: 2px 2px 10px grey;
    }
    
    .name_product{
        margin: 0; 
        font-size:medium; 
        text-align: center;
    }

    .thumbnail{
        position: relative;

        .promo{
            background-color: #0284C7; 
            color: white; 
            text-align: center; 
            position: absolute; 
            top: 0; 
            right: 0; 
            padding: 5px; 
            rotate: 30deg;
        }
        
        .img{
            width:100%;
            height:180px;
        }

        .original_price{
            margin: 0;
        }

        .price{
            margin-top: 5px; 
            margin-bottom: 0; 
            font-weight: bolder;
        }
    }
}
</style>