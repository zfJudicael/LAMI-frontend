<template>
    <div class="news">
        <div v-if="loadingProductList" class="productContainer" style="display: grid; grid-template-columns: repeat( 5, 1fr); gap: 10px; padding: 20px;">
            <ProductSkeleton v-for="i in 10"/>
        </div>

        <div v-else class="productContainer" style="display: grid; grid-template-columns: repeat( 5, 1fr); gap: 10px; padding: 20px;">
            <Card  v-for=" product in productList" class="product-item" @click="$router.push({name: 'productDetailsClient', params: { id: product.id }})">
                <template #title>
                    <p style="margin: 0; font-size:medium; text-align: center;">{{ product.name_product }}</p>
                </template>
                <template #subtitle></template>
                <template #content>
                    <div style="position: relative;">
                        <p v-if="product.promotionProducts?.length" style="background-color: #0284C7; color: white; text-align: center; position: absolute; top: 0; right: 0; padding: 5px; rotate: 30deg;">Promo</p>
                        <img :src="product.getProfileURL()" :alt="`${product.name_product}.png`" width="100%" height="200px">
                        <s v-if="product.promotionProducts?.length" style="margin: 0;">{{ product.price.toLocaleString() }} Ariary</s>
                        <p style="margin-top: 5px; margin-bottom: 0; font-weight: bolder;">{{ product.getPrice().toLocaleString('fr-FR') }} Ariary</p>
                    </div>
                </template>
                <template #footer></template>
            </Card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ProductService } from '@/modules/product/product.service';
import Card from 'primevue/card';
import { Product } from '@/models/Product';
import ProductSkeleton from '@/components/skeleton/ProductSkeleton.vue';

const productList = ref<Product[]>([])
const loadingProductList = ref<boolean>(false)
onMounted(()=>{
    refreshProductList()
})

const refreshProductList = ()=>{
    loadingProductList.value = true
    productList.value = []
    ProductService.getLastUpdated()
        .then((res)=>{
            res.map((value)=>{
                productList.value.push(new Product(value))
            })
        })
        .catch((err)=>{})
        .finally(()=>{ loadingProductList.value = false })
}


</script>