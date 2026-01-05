<template>
    <div class="searchPage">
        <BackButton />
        <h3 >Résultats de la recherche</h3>
        
        <div v-if="isLoading" class="productContainer">
            <ProductSkeleton v-for="i in 5"/>
        </div>
        
        <div v-else> 
            <ProductContainer v-if="productList.length > 0" :products="productList"/>
            <div v-else class="notFound">
                <img :src="StaticFile.file_search" alt="a.img">
                <div>
                    <i class="pi pi-times"></i>
                    <p>Aucun article est trouvé</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import BackButton from '@/components/BackButton.vue';
import ProductContainer from '@/components/ProductContainer/ProductContainer.vue';
import { Product } from '@/models/Product';
import { ProductService } from '@/modules/product/product.service';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import ProductSkeleton from '@/components/skeleton/ProductSkeleton.vue';
import { StaticFile } from '@/constants/staticfiles';

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

<style lang="scss">
.searchPage{
    h3{
        text-align: center;
    }

    .productContainer{
        display: grid; 
        grid-template-columns: repeat(2, 1fr); 
        gap: 10px; 
        padding: 20px;
    }

    .notFound{
        text-align: center;

        img{
            width:350px;
            margin-top: 20px;
        }

        div{
            margin-top: 10px; 
            display: flex; 
            justify-content: center; 
            color: gray; 
            align-items: center;
        }
    }
}

@media screen and (min-width: 768px) {
    .searchPage{
        .productContainer{
            grid-template-columns: repeat( 3, 1fr); 
        }
    }
}

@media screen and (min-width: 1024px) {
    .searchPage{
        .productContainer{
            grid-template-columns: repeat( 5, 1fr); 
        }
    }
}
</style>