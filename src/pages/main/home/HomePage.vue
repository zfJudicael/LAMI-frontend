<template>
    <div class="home">
        <div v-for="(productSection, index) in ProductSection" :id="productSection.category.id">
            <h3 style="margin: 10px 0;">{{ productSection.category.name_categ }}</h3>
            <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                <Chip label="Tout" @click="refreshProductList(index, productSection.category.id)" style="cursor: pointer;"></Chip>
                <Chip v-for="type in productSection.types" :label="type.name_type" @click="filterProductListByType(index, type.id)" style="cursor: pointer; "></Chip>
            </div>
            <div class="productContainer" style="display: grid; grid-template-columns: repeat( 5, 1fr); gap: 10px; padding: 20px;">
                <Card  v-for=" product in productSection.products" class="product-item" @click="$router.push({name: 'productDetailsClient', params: { id: product.id }})">
                    <template #title>
                        <p style="margin: 0; font-size:medium; text-align: center;">{{ product.name_product }}</p>
                    </template>
                    <template #subtitle></template>
                    <template #content>
                        <img :src="product.getProfileURL()" :alt="`${product.name_product}.png`" width="100%" height="200px">
                        <p style="margin-top: 5px; margin-bottom: 0; font-weight: bolder;">{{ product.price.toLocaleString('fr-FR') }} Ariary</p>
                    </template>
                    <template #footer></template>
                </Card>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ICategory } from '@/models/Category';
import { Product } from '@/models/Product';
import type { IType } from '@/models/Type';
import { CategoryService } from '@/modules/category/category.service';
import { ProductService } from '@/modules/product/product.service';
import { TypeService } from '@/modules/type/type.service';
import { onMounted, ref } from 'vue';
import Chip from 'primevue/chip';
import Card from 'primevue/card';


interface IProductSection {
    category: ICategory,
    types?: IType[],
    products?: Product[]
}
const ProductSection = ref<IProductSection[]>([])

onMounted(async ()=>{
    await CategoryService.getAll()
        .then((res)=>{
            res.map((val)=>{
                ProductSection.value.push({
                    category: val
                })
            })
        })
        .catch((err)=>{})

    if(ProductSection.value.length > 0){
        TypeService.getAll()
            .then((res)=>{
                ProductSection.value.forEach((productSection)=>{
                    productSection.types = res.filter((type)=>{
                        return type.categoryId == productSection.category.id
                    })
                })
            })
            .catch((err)=>{

            })
    }

    ProductSection.value.forEach((productSection)=>{
        ProductService.getPublishedByCategory(productSection.category.id)
            .then((product)=>{
                productSection.products = []
                product.map((val)=>{
                    productSection.products?.push(new Product(val))
                })
            }).catch((err)=>{})
        })
})

const filterProductListByType = (productSectionIndex: number, typeId: string)=>{
    ProductService.getPublishedByType(typeId)
        .then((res)=>{
            ProductSection.value[productSectionIndex].products = []
            res.map((val)=>{
                ProductSection.value[productSectionIndex].products?.push(new Product(val)) 
            })
        })
        .catch((err)=>{})
}

const refreshProductList = (index: number, categoryId: string)=>{
    ProductService.getPublishedByCategory(categoryId)
            .then((product)=>{
                ProductSection.value[index].products = []
                product.map((val)=>{
                    ProductSection.value[index].products?.push(new Product(val))
                })
            }).catch((err)=>{})
}

</script>

<style>
.product-item{
    max-width: 280px; 
    background-color: white; 
    cursor: pointer;
}

.product-item:hover{
    box-shadow: 2px 2px 10px grey;
}

</style>