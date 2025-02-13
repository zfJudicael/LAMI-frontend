<template>
    <div class="home">
        <template v-if="loadingProductList">
            <div style="display: flex; justify-content: end;">
                <Skeleton style="width: 300px;" height="40px"/>
            </div>
            <div v-for="i in 2">
                <Skeleton style="width: 200px; margin: 10px 0; height: 25px;"/>
                <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                    <Skeleton v-for="i in 5" borderRadius="16px" style="width: 100px; height: 35px;"/>
                </div>
                <div class="productContainer" style="display: grid; grid-template-columns: repeat( 5, 1fr); gap: 10px; padding: 20px;">
                    <ProductSkeleton v-for="i in 10"/>
                </div>
            </div>
        </template>

        <template v-else>
            <div style="display: flex; justify-content: end;">
                <div style="width: 300px;">
                    <Select v-model="selectedPriceFilter" :options="priceFilter" optionLabel="name" placeholder="Select a City" class="w-full md:w-56" @change="refreshAll"/>
                </div>
            </div>
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
import Select from 'primevue/select';
import ProductSkeleton from '@/components/skeleton/ProductSkeleton.vue';
import Skeleton from 'primevue/skeleton';

const loadingProductList = ref<boolean>(false)
const priceFilter = ref([
    {name: 'Prix dans l\'order croissant', code: 'ASC'},
    {name: 'Prix dans l\'order décroissant', code: 'DESC'}
])
const selectedPriceFilter = ref(priceFilter.value[0])

interface IProductSection {
    category: ICategory,
    types?: IType[],
    products?: Product[]
}
const ProductSection = ref<IProductSection[]>([])

onMounted(async ()=>{
    try {
        loadingProductList.value = true
        await refreshAll()
    } catch (error) {}
    finally{
        loadingProductList.value = false
    }
})

const refreshAll = async ()=>{
    for(let promise of [refreshCategory, refreshType, refreshProduct]){
        await promise()
    }
}
////////Promise 01
const refreshCategory = async ()=>{
    return CategoryService.getAll()
        .then((res)=>{
            res.map((val)=>{
                ProductSection.value.push({
                    category: val
                })
            })
        })
        .catch((err)=>{})
}
////////Promise 02
const refreshType = async ()=>{
    return TypeService.getAll()
            .then((res)=>{
                ProductSection.value.forEach((productSection)=>{
                    productSection.types = res.filter((type)=>{
                        return type.categoryId == productSection.category.id
                    })
                })
            })
            .catch((err)=>{})
}
////////Promise 03
const refreshProduct = async ()=>{
    for(const productSectionItem of ProductSection.value){
        try {
            const product = await ProductService.getPublishedByCategory(productSectionItem.category.id, selectedPriceFilter.value.code)
            productSectionItem.products = []
            product.map((val)=>{
                    productSectionItem.products?.push(new Product(val))
                })
        } catch (error) {}
    }
}


const filterProductListByType = (productSectionIndex: number, typeId: string)=>{
    ProductService.getPublishedByType(typeId, selectedPriceFilter.value.code)
        .then((res)=>{
            ProductSection.value[productSectionIndex].products = []
            res.map((val)=>{
                ProductSection.value[productSectionIndex].products?.push(new Product(val)) 
            })
        })
        .catch((err)=>{})
}

const refreshProductList = (index: number, categoryId: string)=>{
    ProductService.getPublishedByCategory(categoryId, selectedPriceFilter.value.code)
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