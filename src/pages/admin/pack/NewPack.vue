<template>
    <div class="newPack">
        <BackButton />
        <h3 style="text-align: center;">Création d'un nouveau pack</h3>
        <Stepper value="1" linear>
            <StepList>
                <Step value="1">Étape 1</Step>
                <Step value="2">Étape 2</Step>
                <Step value="3">Étape 3</Step>
            </StepList>
            <StepPanels>
                <StepPanel v-slot="{ activateCallback }" value="1">
                    <div class="panel-content" style="min-height: 250px;display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 15px">
                        <div style="display: flex; flex-direction: column; width: 300px;">
                            <label for="namePack">Nom du pack</label>
                            <InputText v-model="newPack.namePack" name="namePack" inputId="namePack" :invalid="namePackError.status"/>
                            <small style="color: red;" v-if="namePackError.status">{{ namePackError.message }}</small>
                        </div>
                        <div style="display: flex; flex-direction: column; width: 300px;">
                            <label for="numberOfProductInPack">Nombre du matériles dans le pack</label>
                            <InputNumber v-model="numberOfProductInPack" name="numberOfProductInPack" inputId="numberOfProductInPack"  :invalid="numberOfProductInPackError.status"/>
                            <small style="color: red;" v-if="numberOfProductInPackError.status">{{ numberOfProductInPackError.message }}</small>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: end; padding: 5px">
                        <Button label="Suivant" icon="pi pi-arrow-right" iconPos="right" @click="passToSecondStep(activateCallback)" size="small"/>
                    </div>
                </StepPanel>
                
                <StepPanel v-slot="{ activateCallback }" value="2">
                    <div class="panel-content" style="min-height: 250px;display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 15px">
                        <div v-for="i in numberOfProductInPack" style="width: 600px;">
                            <hr>
                            <p style="text-align: center;">Matériel n°:{{ i }}</p>
                            <div v-if="newPack.packProduct && getProductById(newPack.packProduct[i-1]?.productId).length > 0">
                                <table style="width: 100%; text-align: center">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nom de la matériel</th>
                                            <th></th>
                                            <th>Quantité</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{{ getProductById(newPack.packProduct[i-1]?.productId)[0].id }}</td>
                                            <td>{{ getProductById(newPack.packProduct[i-1]?.productId)[0].name_product }}</td>
                                            <td><img :src="getProductById(newPack.packProduct[i-1]?.productId)[0].getProfileURL()" :alt="`${getProductById(newPack.packProduct[i-1]?.productId)[0].name_product}.png`" width="100px"></td>
                                            <td>
                                                <InputNumber v-model="newPack.packProduct[i-1].quantity" showButtons :min="1" :max="100"/>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <Button label="Selectionner" size="small" @click="showSelectDialog(i-1)"/>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 5px">
                        <Button label="Retour" severity="secondary" icon="pi pi-arrow-left" @click="goBackToFirstStep(activateCallback)" size="small"/>
                        <Button label="Suivant" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback('3')" size="small" :disabled="isSecondButtonDisabled"/>
                    </div>
                </StepPanel>
                
                <StepPanel v-slot="{ activateCallback }" value="3">
                    <div class="panel-content" style="min-height: 250px;display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 15px">
                        <h3>Pack : {{ newPack.namePack }}</h3>
                        <table style="width: 60%;">
                            <tbody>
                                <tr v-for="(product, index) in newPack.packProduct">
                                    <td>{{ index }}</td>
                                    <td>{{ getProductById(product.productId)[0].name_product }}</td>
                                    <td><Badge :value="`x${product.quantity}`" severity="info"/></td>
                                    <td>{{ (getProductById(product.productId)[0].price*product.quantity).toLocaleString('fr-FR') }} Ar</td>
                                </tr>
                                <tr>
                                    <td colspan="3">Prix total des matériels</td>
                                    <td>{{ totalPrice.toLocaleString('fr-FR') }} Ar</td>
                                </tr>
                            </tbody>
                        </table>
                        <div style="display: flex; flex-direction: column; width: 300px;">
                            <label for="pricePack">Entrez ci dessous le prix que vous souhaitez attribuer à ce dernier</label>
                            <InputNumber v-model="newPack.pricePack" name="pricePack" inputId="pricePack" suffix=" Ariary" :invalid="pricePackError.status"/>
                            <small style="color: red;" v-if="pricePackError.status">{{ pricePackError.message }}</small>
                        </div>
                        <Button label="Confirmer" @click="createPack"/>
                    </div>
                    <div style="display: flex; justify-content: start; padding: 5px">
                        <Button label="Retour" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback('2')" size="small"/>
                    </div>    
                </StepPanel>
            </StepPanels>
        </Stepper>

        <Dialog v-model:visible="selectProduct" modal :draggable="false">
            <div style="display: flex; justify-content: center; align-items: center;">
                <InputText v-model="productNameFilter" name="filter" inputId="filter" size="small" placeholder="Filtrer par le nom du matériel"/>
                <!-- <Button label="Chercher" rounded size="small"/> -->
            </div>
            <table class="product_table">
                <thead>
                    <tr>
                        <th>Identifiant</th>
                        <th>Nom</th>
                        <th>Photo</th>
                        <th>Prix</th>
                    </tr>
                </thead>
                <tbody v-if="productListToShow.length > 0">
                    <tr v-for="product in productListToShow" @click="chooseProduct(product.id as number)">
                        <th>{{ product.id }}</th>
                        <th>{{ product.name_product }}</th>
                        <th><img :src="product.getProfileURL()" :alt="`${product.name_product}.png`" width="100px"></th>
                        <th>{{ product.price.toLocaleString('fr-FR') }} Ar</th>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <th colspan="4" style="text-align: center;">Donnée vide</th>
                    </tr>
                </tbody>
            </table>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import BackButton from '@/components/BackButton.vue';
import Stepper from 'primevue/stepper';
import StepList from 'primevue/steplist';
import Step from 'primevue/step';
import StepPanels from 'primevue/steppanels';
import StepPanel from 'primevue/steppanel';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dialog from 'primevue/dialog';
import Badge from 'primevue/badge';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import type { IPack, IPackProduct } from '@/models/Pack';
import { Product } from '@/models/Product';
import { ProductService } from '@/modules/product/product.service';
import { PackService } from '@/modules/pack/pack.service';
import { useToast } from 'primevue/usetoast';

const productList = ref<Product[]>([])
const productListToShow = ref<Product[]>([])

onMounted(()=>{
   refreshProductList()
})

const refreshProductList = ()=>{
    ProductService.getAll()
        .then((res)=>{
            productList.value = []
            productListToShow.value = []
            res.forEach((val)=>{
                productList.value.push(new Product(val))
            })
            productListToShow.value = productList.value
        })
        .catch((err)=>{})
}

const getProductById = (productId: number)=>{
    return productList.value.filter((val)=>{
        return val.id === productId
    })
}

const newPack = reactive<IPack>({
    namePack: '',
    pricePack: 0
})

const numberOfProductInPack = ref<number>(0)

const namePackError = ref({
    status: false,
    message : ''
})

const pricePackError = ref({
    status: false,
    message : ''
})

const numberOfProductInPackError = ref({
    status: false,
    message: ''
})

const goBackToFirstStep = (activateCallback: any)=>{
    newPack.packProduct = undefined
    activateCallback('1')
}

const isSecondButtonDisabled = computed(()=>{
    if(newPack.packProduct) return newPack.packProduct?.length < numberOfProductInPack.value
    else return true
})

const passToSecondStep = (activateCallback: any)=>{
    if(!newPack.namePack){
        namePackError.value.status = true
        namePackError.value.message = 'Champ réquise'
    }else{
        namePackError.value.status = false

        if(isNaN(numberOfProductInPack.value) || numberOfProductInPack.value <= 0 ){
            numberOfProductInPackError.value.status = true
            numberOfProductInPackError.value.message = 'Valeur minimum du champ: 1 '
        }else{
            numberOfProductInPackError.value.status = false
            activateCallback('2')
        }
    }
}


//////////////////////////////////////////////////
//////////////////////////////////////////////////

const selectProduct = ref<boolean>(false)
const selectedIndex = ref<number>()
const productNameFilter = ref<string>('')

const showSelectDialog = (index: number)=>{
    selectProduct.value = true
    selectedIndex.value = index
}

watch(productNameFilter, (newValue, oldValue)=>{
    if(newValue){
        productListToShow.value = productList.value.filter((product)=>{
            return product.name_product.includes(newValue.toUpperCase())
        })
    }else{
        productListToShow.value = productList.value 
    }
})

const chooseProduct = (productId: number)=>{
    try {
        if(!newPack.packProduct) newPack.packProduct = []
    
        newPack.packProduct[selectedIndex.value as number] = {
                productId: productId,
                packId: NaN,
                quantity: 1
            }
    } catch (error) {}
}

const totalPrice = computed(()=>{
    var totalPrice = 0
    try {
        newPack.packProduct?.forEach((pack)=>{
            totalPrice += getProductById(pack.productId)[0].price * pack.quantity
        })
    } catch (error) {}
    return totalPrice
})

const toast = useToast()
const createPack = ()=>{
    if(isNaN(newPack.pricePack) || newPack.pricePack <= 0 ){
        pricePackError.value.status = true
        pricePackError.value.message = 'Veuillez bien remplir ce champ'
    }else{
        pricePackError.value.status = false
        PackService.create(newPack)
            .then((res)=>{
                toast.add({ severity: 'success', summary: 'Ajout d\'un nouveau pack', detail: 'Requête effectuée avec succès', life: 3000 })
            })
            .catch((err)=>{
                toast.add({ severity: 'error', summary: 'Ajout d\'un nouveau pack', detail: 'Echec de la requête', life: 3000 })
            })
    }
}
</script>


<style>
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
    cursor: pointer;
}
</style>