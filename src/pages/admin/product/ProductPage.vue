<template>
    <div class="product-page">
        <Button label="Ajouter un nouveau produit" icon="pi pi-plus-circle" iconPos="right" @click="goTo('newProduct')" size="small" rounded/>

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
                        <th rowspan="1">Identifiant</th>
                        <th rowspan="1">Nom du produit</th>
                        <th rowspan="1">Photo</th>
                        <th rowspan="1">Marque</th>
                        <!-- <th rowspan="1">Type</th> -->
                        <th rowspan="1">Prix</th>
                        <th rowspan="1">Etat de stock</th>
                        <th colspan="1">Quantité disponible</th>
                        <th rowspan="1">En vente</th>
                        <th rowspan="1">Plus de details</th>
                    </tr>
                    <!-- <tr>
                        <th>Disponible</th>
                        <th>Réservée</th>
                    </tr> -->
                </thead>
                <tbody v-if="products.length > 0">
                        <tr v-for="product in products" class="product_data">
                            <td>{{ product.id }}</td>
                            <td>{{ product.name_product }}</td>
                            <td><img :src="product.getProfileURL()" :alt="`${product.name_product}.png`" style="width: 100px;"></td>
                            <td>{{ product.brand }}</td>
                            <!-- <td>{{ product.typeId }}</td> -->
                            <td>{{ product.price.toLocaleString("fr-FR") }} Ar</td>
                            <td :style="product.getStockStatus().style">{{ product.getStockStatus().message }}</td>
                            <td>
                                <div style="display: flex; flex-direction: column; align-items: center;">
                                    <p style="margin: 0;">
                                        {{ product.availableQuantity }}
                                    </p>
                                    <div class="editBTN" @click="openDialog(product)">
                                        <i class="pi pi-pen-to-square"></i>
                                        <span>Modifier</span>
                                    </div>
                                </div>
                            </td>
                            <!-- <td>{{ product.reservedQuantity }}</td> -->
                            <td>
                                <i v-if="product.isPublished" class="pi pi-check-circle" style="color: green;"></i>
                                <i v-else class="pi pi-times" style="color: red;"></i>
                            </td>
                            <td>
                                <Button icon="pi pi-book" size="small" rounded outlined @click="router.push({name: 'productDetailsAdmin', params: {id: product.id }})"></Button>
                            </td>
                        </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="9">Aucun donnée</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <Dialog v-model:visible="showDialog" modal header="Mise à jour de stock":draggable="false" :style="{ width: '25rem' }">
            <p style="margin: 0;">Désignation du matériel : {{ selectedProduct?.name_product }}</p>
            <form>
                <div class="input" style="display: flex; flex-direction: column; margin-top: 10px;">
                    <label for="quantity">Quantité*</label>
                    <InputNumber name="quantity" id="quantity" v-model="availableQuantity" :invalid="availableQuantityError.value ? true : false" :min="0"/> 
                    <small class="errorMessage" style="color: red;">{{ availableQuantityError.message }}</small>
                </div>
                <Divider />
                <div class="BTN">
                        <Button type="button" label="Confirmer" class="btn1" @click="editAvailableQuantity"></Button>
                        <Button type="button" label="Annuler" severity="secondary" @click="closeDialog"></Button>
                    </div>
            </form>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import Select from 'primevue/select';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import Divider from 'primevue/divider';
import { goTo } from '@/use/useGoTo';
import { onMounted, ref } from 'vue';
import { Product } from '@/models/Product';
import { ProductService } from '@/modules/product/product.service';
import type { ICategory } from '@/models/Category';
import { CategoryService } from '@/modules/category/category.service';
import type { IType } from '@/models/Type';
import { TypeService } from '@/modules/type/type.service';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

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

const showDialog = ref<boolean>(false)
const selectedProduct = ref<Product>()
const availableQuantity = ref<number>()

const openDialog = (product: Product)=>{
    selectedProduct.value = product
    availableQuantity.value = product.availableQuantity
    showDialog.value = true
}

const closeDialog = ()=>{
    showDialog.value = false
    availableQuantityError.value.value = false
    availableQuantityError.value.message = ''
}

const availableQuantityError = ref({
    value: false,
    message: ''
})

const toast = useToast()
const editAvailableQuantity = ()=>{
    if(availableQuantity.value == undefined){
        availableQuantityError.value.value = true
        availableQuantityError.value.message = 'Veuilez remplir ce champ'
    }else{
        if(availableQuantity.value < 0){
            availableQuantityError.value.value = true
            availableQuantityError.value.message = 'Valeur minimum 0'
        }else{
            availableQuantityError.value.value = false
            availableQuantityError.value.message = ''

            ProductService.updateAvailableQuantity(
                selectedProduct.value?.id as number,
                {availableQuantity: availableQuantity.value}
            ).then(()=>{
                refreshProductList()
                closeDialog()
                toast.add({ severity: 'success', summary: 'Succès', detail: 'Mise à jour de stock bien effectué', life: 3000 })
            })
            .catch(()=>{
                toast.add({ severity: 'error', summary: 'Echec', detail: 'Mise à jour de stock echouée', life: 3000 })
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


.editBTN{
    display: flex;
    gap: 5px; 
    background-color: #6DF7C8; 
    width: fit-content; 
    padding: 4px; 
    border-radius: 5px;
}

.editBTN:hover{
    color: white;
    background-color: #10B981;
}

.editBTN > span{
    display: none;
    transition: all 5s;
}

.editBTN:hover >span{
    display: inline;
    color: white;
}

.BTN{
    margin-top: 20px;
    display: flex;
    gap: 10px;
}

.BTN .btn1{
    flex-grow: 2;
}
</style>