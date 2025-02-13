<template>
    <div class="searchPage">
        <BackButton />
        <h3 style="text-align: center;">Résultats de la recherche</h3>
        
        <div v-if="isLoading" class="productContainer" style="display: grid; grid-template-columns: repeat( 5, 1fr); gap: 10px; padding: 20px;">
            <ProductSkeleton v-for="i in 5"/>
        </div>
        
        <div v-else> 
            <div v-if="productList.length > 0" class="productContainer" style="display: grid; grid-template-columns: repeat( 5, 1fr); gap: 10px; padding: 20px;">
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
            <div v-else style="margin-top: 20px; display: flex; justify-content: center; color: gray; align-items: center;">
                <i class="pi pi-times"></i>
                <p>Aucun article est trouvé</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import BackButton from '@/components/BackButton.vue';
import Card from 'primevue/card';
import { Product } from '@/models/Product';
import { ProductService } from '@/modules/product/product.service';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import ProductSkeleton from '@/components/skeleton/ProductSkeleton.vue';

const route = useRoute()
const productList = ref<Product[]>([])
const isLoading = ref<boolean>(false)

onMounted(()=>{
    refreshProductList()
})

const refreshProductList = ()=>{
    productList.value = []
    isLoading.value = true
    ProductService.getByName(route.query.name_product as string)
        .then((res)=>{
            res.map((value)=>{
                productList.value.push(new Product(value))
            })
        })
        .catch((err)=>{})
        .finally(()=> isLoading.value = false)
}

watch(() => route.query.name_product, () => {
  refreshProductList();
});
</script>