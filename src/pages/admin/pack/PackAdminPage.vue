<template>
    <div class="packAdminPage">
        <Button label="Créer un nouveau pack" icon="pi pi-plus-circle" iconPos="right" @click="goTo('newPack')" size="small" rounded/>

        <Card style="margin-top: 10px;" v-for="pack in packList">
            <template #header>
                <h3 style="margin: 5px; text-align: center;">{{ pack.namePack }} (ID: {{ pack.id }}) Prix : {{ pack.pricePack.toLocaleString('fr-FR') }} Ariary</h3>
            </template>
            <template #content>
                <div style="display: flex; align-items: center; gap: 5px;">
                    <h3 style="margin: 0;">Disponible en vente:</h3>
                    <p v-if="pack.isPublished" style="color: green; font-size: larger;">Oui</p>
                    <p v-else style="color: red; font-size: larger;">Non</p>
                </div>
                <table style="width: 100%; text-align: center;">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nom de la pack</th>
                            <th></th>
                            <th>Prix</th>
                            <th>Nombre</th>
                            <th colspan="2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="packProduct in pack.product">
                            <td>{{ packProduct.product.id }}</td>
                            <td>{{ packProduct.product.name_product }}</td>
                            <td><img style="max-width: 300px;" :src="packProduct.product.getProfileURL()" :alt="`${packProduct.product.name_product}.png`"></td>
                            <td>{{ packProduct.product.price.toLocaleString("fr-FR") }} Ar</td>
                            <td>{{ packProduct.quantity }}</td>
                            <td>
                                <Button size="small" severity="info" rounded style="margin-right: 2px;" icon="pi pi-pen-to-square" @click="openEditPackProductDialog(
                                    pack.id as number, 
                                    packProduct.product.id as number,
                                    packProduct.quantity,
                                    pack.namePack,
                                    packProduct.product.name_product)"/></td>
                            <td>
                                <Button size="small" severity="danger" rounded icon="pi pi-trash" outlined v-if="!(pack.product.length <= 1)" @click="removePackProductConfirmation(pack.id as number, packProduct.product.id as number)"/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </template>
            <template #footer>
                <div style="text-align: right;">
                    <Button label="Modifier" size="small" severity="info" rounded style="margin-right: 2px;" icon="pi pi-pen-to-square" @click="openEditPackDialog(pack)"/>

                    <Button v-if="!pack.isPublished" label="Mettre en vente" size="small" rounded icon="pi pi-calendar-plus" @click="changePublishStatus(pack.id as number, true)" style="margin-right: 2px;"/>
                    <Button v-else label="Retirer de la vente" size="small" rounded icon="pi pi-calendar-minus" @click="changePublishStatus(pack.id as number, false)" style="margin-right: 2px;"/>

                    <Button label="Supprimer" size="small" severity="danger" rounded icon="pi pi-trash" @click="removePackConfirmation(pack.id as number)"/>
                </div>
            </template>
        </Card>
        <Dialog 
            v-model:visible="showEditPackDialog" 
            modal 
            header="Mise à jour pack" 
            :draggable="false" 
            :style="{ width: '25rem' }">
            <form class="editPack">
                <div class="input" style="display: flex; flex-direction: column;">
                    <label for="namePack">Nom du pack*</label>
                    <InputText name="namePack" id="namePack" v-model="namePack" :invalid="editPackError.namePack ? true : false"/> 
                    <small class="errorMessage" style="color: red;">{{ editPackError.namePack }}</small>
                </div>
                <div class="input" style="display: flex; flex-direction: column;">
                    <label for="pricePack">Prix*</label>
                    <InputNumber name="pricePack" id="pricePack" v-model="pricePack" suffix=" Ariary" :invalid="editPackError.pricePack ? true : false"/> 
                    <small class="errorMessage" style="color: red;">{{ editPackError.pricePack }}</small>
                </div>
                <div style="display: flex; gap: 5px; margin-top: 5px;">
                    <Button label="Confirmer" style="flex-grow: 2;" @click="onEditPackSubmit"/>
                    <Button label="Annuler" @click="toggleShowEditPackDialog" style="flex-grow: 1;" outlined/>
                </div>
            </form>
        </Dialog>

        <Dialog
            v-model:visible="showEditPackProductDialog" 
            modal 
            :header="`Mise à jour du nombre de matériel`" 
            :draggable="false" 
            :style="{ width: '25rem' }">

            <p>Pack: {{ selectedPackName }}</p>
            <p>Matériel: {{ selectedProductName }}</p>

            <form>
                <div style="display: flex; flex-direction: column;">
                    <label for="quantity">Quantité*</label>
                    <InputNumber name="quantity" id="quantity" v-model="quantity" :invalid="editPackProductError.quantity ? true : false" showButtons/> 
                    <small class="errorMessage" style="color: red;">{{ editPackProductError.quantity }}</small>
                </div>
                <div style="display: flex; gap: 5px; margin-top: 5px;">
                    <Button label="Confirmer" style="flex-grow: 2;" @click="onEditPackProductSubmit"/>
                    <Button label="Annuler" @click="toggleShowEditPackProductDialog" style="flex-grow: 1;" outlined/>
                </div>
            </form>
        </Dialog>

        <ConfirmDialog></ConfirmDialog>
    </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import Card from 'primevue/card';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import ConfirmDialog from 'primevue/confirmdialog';
import { goTo } from '@/use/useGoTo';
import { onMounted, ref } from 'vue';
import { PackService } from '@/modules/pack/pack.service';
import type { IPack } from '@/models/Pack';
import { Product } from '@/models/Product';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string, number } from 'yup';
import { useField, useForm } from 'vee-validate';
import InputNumber from 'primevue/inputnumber';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { PackProductService } from '@/modules/pack/packProduct/pack.product.service';

interface IProductPack {
    quantity: number,
    product: Product
}

interface IPackFull extends IPack{
    product: IProductPack[]
}

const packList = ref<IPackFull[]>([])
onMounted(()=>{
    refreshPackList()
})

const refreshPackList = ()=>{
    packList.value = []
    PackService.getAll()
        .then((res)=>{

            res.forEach((pack)=>{
                let productList: IProductPack[] = []
                pack.packProduct?.forEach((packProduct)=>{
                    if(packProduct.product) productList.push({
                        quantity: packProduct.quantity,
                        product: new Product(packProduct.product)
                    })
                })

                packList.value.push({
                    id: pack.id as number,
                    namePack: pack.namePack,
                    pricePack: pack.pricePack,
                    isPublished: pack.isPublished,
                    product: productList
                })
            })

        })
        .catch((err)=>{})
}


const PackValidationSchema = toTypedSchema(
    object({
        namePack: string()
            .required('Nom obligatoire')
            .default(''),
        pricePack: number()
            .required('Remplir le prix')
            .default(0)
    })
)

const { handleSubmit: handleEditPackSubmit, errors: editPackError } = useForm({
    validationSchema: PackValidationSchema
})

const { value: namePack } = useField('namePack')
const { value: pricePack } = useField('pricePack')

const showEditPackDialog = ref<boolean>(false)
const toggleShowEditPackDialog = ()=>{
    showEditPackDialog.value = !showEditPackDialog.value
}

const selectedPack = ref<IPack>()
const openEditPackDialog = (pack: IPackFull)=>{
    selectedPack.value = {
        id: pack.id,
        namePack: pack.namePack,
        pricePack: pack.pricePack,
        isPublished: pack.isPublished
    }

    namePack.value = pack.namePack
    pricePack.value = pack.pricePack

    toggleShowEditPackDialog()
}

const toast = useToast()
const onEditPackSubmit = handleEditPackSubmit((values)=>{
    PackService.update(selectedPack.value?.id as number, values)
        .then((res)=>{
            toast.add({ severity: 'success', summary: 'Succès', detail: 'la modification a bien été effectuée', life: 3000 })
            toggleShowEditPackDialog()
            refreshPackList()
        })
        .catch((err)=>{
            toast.add({ severity: 'error', summary: 'Echec', detail: 'La modification a echouée', life: 3000 })
        })
})

const confirm = useConfirm()
const removePackConfirmation = (packId: number) => {
    confirm.require({
        message: 'Êtes vous sûr d\'y procéder?',
        header: 'Confirmation',
        icon: 'pi pi-info-circle',
        rejectProps: {
            label: 'Annluer',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Sauvegarder',
            severity: 'danger'
        },
        accept: () => {
            PackService.delete(packId)
                .then((res)=>{
                    refreshPackList()
                    toast.add({ severity: 'success', summary: 'Succès de la suppression', life: 3000 });
                })
                .catch((err)=>{
                    console.log(err)
                    toast.add({ severity: 'error', summary: 'Échec de la suppression', life: 3000 });
                })
        },
        reject: () => {}
    });
};


const showEditPackProductDialog = ref<boolean>(false)
const toggleShowEditPackProductDialog = ()=>{
    showEditPackProductDialog.value = !showEditPackProductDialog.value
}

const selectedPackId = ref<number>(0)
const selectedPackName = ref<string>('')
const selectedProductName = ref<string>('')
const selectedProductId = ref<number>(0)
const openEditPackProductDialog = (packId: number, productId: number, quantitySelected: number, packName: string, productName: string)=>{
    selectedPackId.value = packId
    selectedProductId.value = productId
    quantity.value = quantitySelected
    selectedPackName.value = packName
    selectedProductName.value = productName

    toggleShowEditPackProductDialog()
}

const PackProductValidationSchema = toTypedSchema(
    object({
        quantity: number()
                .min(1, 'Valeur minimun 1')
                .required('Champ obligatoire')
    })
)

const { handleSubmit: handleEditPackProductSubmit, errors: editPackProductError } = useForm({
    validationSchema: PackProductValidationSchema
})

const { value: quantity } = useField('quantity')

const onEditPackProductSubmit = handleEditPackProductSubmit((values)=>{
    PackProductService.editQuantity({
        packId: selectedPackId.value,
        productId: selectedProductId.value,
        quantity: values.quantity
    })
        .then((res)=>{
            toast.add({ severity: 'success', summary: 'Succès', detail: 'la modification a bien été effectuée', life: 3000 })
            toggleShowEditPackProductDialog()
            refreshPackList()
        })
        .catch((err)=>{
            toast.add({ severity: 'error', summary: 'Echec', detail: 'La modification a echouée', life: 3000 })
        })
})

const removePackProductConfirmation = (packId: number, productId: number) => {
    confirm.require({
        message: 'Êtes vous sûr d\'y procéder?',
        header: 'Confirmation',
        icon: 'pi pi-info-circle',
        rejectProps: {
            label: 'Annluer',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Sauvegarder',
            severity: 'danger'
        },
        accept: () => {
            PackProductService.delete(packId, productId)
                .then((res)=>{
                    refreshPackList()
                    toast.add({ severity: 'success', summary: 'Succès de la suppression', life: 3000 });
                })
                .catch((err)=>{
                    console.log(err)
                    toast.add({ severity: 'error', summary: 'Échec de la suppression', life: 3000 });
                })
        },
        reject: () => {}
    });
};


///////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
const changePublishStatus = (packId: number, newValue: boolean)=>{
    confirm.require({
        message: 'Êtes vous sûr d\'y procéder?',
        header: 'Confirmation',
        icon: 'pi pi-info-circle',
        rejectProps: {
            label: 'Annluer',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Sauvegarder',
            severity: 'info'
        },
        accept: () => {
            PackService.update(packId, {
                    isPublished: newValue
                })
                .then((res)=>{
                    console.log(res)
                    refreshPackList()
                    toast.add({ severity: 'success', summary: 'Succès de la modification', life: 3000 });
                })
                .catch((err)=>{
                    console.log(err)
                    toast.add({ severity: 'error', summary: 'Échec de la modification', life: 3000 });
                })
        },
        reject: () => {}
    });


}
</script>