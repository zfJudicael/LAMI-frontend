<template>
    <div class="product-page">
        <Button label="Ajouter nouveau" icon="pi pi-plus-circle" iconPos="right" @click="goTo('newProduct')" rounded/>

        <div class="card">
            <div class="filter_product" >
                <div>
                    <label for="name_categ">Catégorie : </label>
                    <Select v-model="selectedCategory" :options="categories" optionLabel="name_categ" v-on:update:modelValue="onSelectCategory"></Select>
                </div>
                <div>
                    <label for="name_type">Type : </label>
                    <Select v-model="selectedTypes" :options="types" optionLabel="name_type"></Select>
                </div>
                <Button label="Filtrer" icon="pi pi-align-left" :disabled="isFilterButtonDisabled" @click="filterProducts"/>
            </div>
            <table class="product_table">
                <thead>
                    <tr>
                        <th rowspan="2">Identifiant</th>
                        <th rowspan="2">Nom du produit</th>
                        <th rowspan="2">Photo</th>
                        <th rowspan="2">Marque</th>
                        <th rowspan="2">Type</th>
                        <th rowspan="2">Prix</th>
                        <th colspan="2">Quantité</th>
                        <th rowspan="2">En vente</th>
                        <th rowspan="2">Plus de details</th>
                    </tr>
                    <tr>
                        <th>Disponible</th>
                        <th>Réservée</th>
                    </tr>
                </thead>
                <tbody v-if="products.length > 0">
                        <tr v-for="product in products" class="product_data">
                            <td>{{ product.id }}</td>
                            <td>{{ product.name_product }}</td>
                            <td><img :src="product.getProfileURL()" :alt="`${product.name_product}.png`" style="width: 100px;"></td>
                            <td>{{ product.brand }}</td>
                            <td>{{ product.typeId }}</td>
                            <td>{{ product.price.toLocaleString("fr-FR") }} Ar</td>
                            <td>{{ product.availableQuantity }}</td>
                            <td>{{ product.reservedQuantity }}</td>
                            <td>
                                <i v-if="product.isPublished" class="pi pi-check-circle" style="color: green;"></i>
                                <i v-else class="pi pi-times" style="color: red;"></i>
                            </td>
                            <td>
                                <Button icon="pi pi-book" size="small" rounded outlined @click="router.push({name: 'productDetails', params: {id: product.id }})"></Button>
                            </td>
                        </tr>
                </tbody>
                <tbody v-else>
                    <tr>A</tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import Select from 'primevue/select';
import Badge from 'primevue/badge';
import { goTo } from '@/use/useGoTo';
import { onMounted, ref } from 'vue';
import { Product } from '@/models/Product';
import { ProductService } from '@/modules/product/product.service';
import type { ICategory } from '@/models/Category';
import { CategoryService } from '@/modules/category/category.service';
import type { IType } from '@/models/Type';
import { TypeService } from '@/modules/type/type.service';
import { useRouter } from 'vue-router';

const router = useRouter()
const products = ref<Product[]>([])
const categories = ref<ICategory[]>([{
    id: 'ALL',
    name_categ: 'Toutes catégories'
}])

const types = ref<IType[]>([])

const selectedCategory = ref<ICategory>()
const selectedTypes = ref<IType>()

const isFilterButtonDisabled = ref<boolean>(true)

onMounted(()=>{
    refreshCategoryList()
    refreshProductList()
    selectedCategory.value = categories.value[0]
})

const refreshProductList = ()=>{
    products.value = []
    ProductService.getAll().then((res)=>{
        res.map((val)=>{
            products.value.push(new Product(val))
        })  
    })
}

const refreshCategoryList = ()=>{
    CategoryService.getAll().then((res)=>{
        categories.value = categories.value.concat(res)
    })
}

const refreshTypeList = ()=>{
    types.value = []
    if(selectedCategory.value?.id && selectedCategory.value.id != 'ALL'){
        TypeService.getByCategoryId(selectedCategory.value.id)
            .then((val)=>{
                types.value.push({
                    id: 'ALL',
                    name_type: 'Toutes types'
                })
                types.value = types.value.concat(val)
                selectedTypes.value = types.value[0]
            })
    }
}

const onSelectCategory = ()=>{
    isFilterButtonDisabled.value = false;
    refreshTypeList()
}

const filterProducts = ()=>{
    if(selectedCategory.value?.id == 'ALL'){
        refreshProductList()
    }else{
        if(selectedTypes.value?.id == 'ALL'){
            if(selectedCategory.value?.id) ProductService.getByCategory(selectedCategory.value.id).then((res)=>{
                products.value = []
                res.map((val)=>{
                    products.value.push(new Product(val))
                })  
            })
        }else{
            if(selectedTypes.value?.id) ProductService.getByType(selectedTypes.value.id).then((res)=>{
                products.value = []
                res.map((val)=>{
                    products.value.push(new Product(val))
                })  
            })
        }
    }

}


</script>

<style>
.product-page .filter_product{
    display: flex;
    gap: 15px;
    margin: 10px 0;
}

.product_table{
 text-align: center;
 width: 100%;
}

.product_table thead tr{
    background-color: #10B981;
}

.product_table thead tr th{
    padding: 5px;
}

.product_table tbody tr{
  background-color: white;  
}

.product_table tbody tr:hover{
    background-color: #f0efef;
    cursor: default;
}


</style>