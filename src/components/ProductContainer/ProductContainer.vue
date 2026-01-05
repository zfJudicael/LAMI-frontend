<template>
    <div class="productContainer">
        <ProductItem v-for="product in $props.products" :product="product"/>
    </div>
</template>

<script setup lang="ts">
import ProductItem from '../ProductItem.vue';
import { Product } from '@/models/Product';

defineProps<{
    products?: Product[]
}>()
</script>

<style lang="scss">
.productContainer{
    display: grid; 
    grid-template-columns: repeat( 2, 1fr); 
    gap: 10px; 
    padding: 10px 0;
}

@media screen and (min-width: 768px) {
    .productContainer{
        grid-template-columns: repeat( 3, 1fr); 
        gap: 10px; 
        padding: 20px;
    }
}

@media screen and (min-width: 1024px) {
    .productContainer{
        grid-template-columns: repeat( 5, 1fr); 
    }
}
</style>