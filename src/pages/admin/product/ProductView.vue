<template>
    <div class="product">
        <p>{{ product?.name_product }}</p>
    </div>
</template>

<script setup lang="ts">
import { Product } from '@/models/Product';
import { ProductService } from '@/modules/product/product.service';
import { onMounted, ref } from 'vue';

const props = defineProps(['id'])

const product = ref<Product>()
onMounted(async ()=>{
    product.value = new Product(await ProductService.getOne(props.id))
})
</script>