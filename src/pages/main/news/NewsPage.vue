<template>
    <div class="news">
        <div v-if="loadingProductList" class="productContainer" style="display: grid; grid-template-columns: repeat( 5, 1fr); gap: 10px; padding: 20px;">
            <ProductSkeleton v-for="i in 10"/>
        </div>

        <ProductContainer v-else :products="productList"/>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ProductService } from '@/modules/product/product.service';
import { Product } from '@/models/Product';
import ProductContainer from '@/components/ProductContainer/ProductContainer.vue';
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