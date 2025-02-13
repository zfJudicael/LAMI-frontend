<template>
    <div class="product">
        <template v-if="product">
            <BackButton />
            <div style="display: flex;">
                <div>
                    <div class="presentationPhoto" style="display: flex; flex-direction: column; padding: 10px;">
                        <div style="display: flex; justify-content: center; margin-bottom: 10px;">
                            <img :src="product.getProfileURL()" :alt="`${product.name_product}.png`" width="200px">
                        </div>
                        <Button @click="changeProfilePictureDialogVisible = true">Changer la photo de présentation</Button>
                    </div>
                    <div class="otherPhotos" style="display: flex; flex-direction: column; padding: 10px;">
                        <Carousel :value="product.getOtherPicturesURL()" :num-visible="1" style="width: 300px;">
                            <template #item="slotProps">
                                <div>
                                    <img :src="slotProps.data" alt="otherPics.png" width="200px" style="margin-left: auto; margin-right: auto;">
                                </div>
                            </template>
                        </Carousel>
                        <Button @click="changeOtherPictureDialogVisibles = true">{{product.getOtherPicturesURL().length > 0 ? "Changer les autres photos" : "Ajouter"}}</Button>
                    </div>
                </div>
                <Card style="padding: 10px; flex-grow: 2;">
                    <template #content>
                        <p>ID : {{ product.id }}</p>
                        <p>Désignation du matériel : {{ product.name_product }}</p>
                        <h3>Déscription</h3>
                        <p>{{ product.description }}</p>
                        <p>Marque : {{ product.brand }}</p>
                        <p>Couleur disponible : {{ product.color }}</p>
                        <p>Quantité :</p>
                        <ul>
                            <li>Disponible : {{ product.availableQuantity }}</li>
                            <li>Reservée : {{ product.reservedQuantity }}</li>
                        </ul>
                        <p>Prix unitaire : {{ product.price.toLocaleString("fr-FR") }} Ariary</p>
                        <h3>Spécification téchnique</h3>
                        <p>{{ product.technicalSpecification }}</p>
                        <div class="BTN">
                            <Button @click="openEditInformationDialog">Modifier informations</Button>
                            <Button severity="info" @click="confirmUpdatePublishStatus(!product.isPublished)">{{ product.isPublished ? 'Retirer de la vente' : 'Mettre en vente'}}</Button>
                            <Button severity="contrast" outlined @click="$router.push({name: 'newPromotionProduct', params: {productId: product.id}})">Ajouter à une promotion</Button>
                            <Button severity="danger" :disabled="product.availableQuantity > 0 || product.reservedQuantity > 0" @click="confirmDeleteProduct">Supprimer</Button>
                        </div>
                    </template>
                </Card>
            </div>

            <Dialog v-model:visible="editInformationDialogVisible" modal header="Mettre à jour les informations":draggable="false" :style="{ width: '25rem' }">
                <form class="editInformation">
                    <div class="input">
                    <label for="name_product">Nom du produit*</label>
                    <InputText name="name_product" id="name_product" v-model="name_product" :invalid="errors.name_product ? true : false"/> 
                    <small class="errorMessage">{{ errors.name_product }}</small>
                </div>

                <div class="input">
                    <label for="brand">Marque*</label>
                    <InputText name="brand" id="brand" v-model="brand" :invalid="errors.brand ? true : false"/> 
                    <small class="errorMessage">{{ errors.brand }}</small>
                </div>

                <div class="input">
                    <label for="description">Déscription</label>
                    <Textarea name="description" id="description" v-model="description"/>
                    <small class="errorMessage">{{ errors.description }}</small>
                </div>

                <div class="input">
                    <label for="color">Couleur</label>
                    <InputText name="color" id="color" v-model="color"/> 
                    <small class="errorMessage">{{ errors.color }}</small>
                </div>

                <div class="input">
                    <label for="price">Prix unitaire*</label>
                    <InputNumber name="price" input-id="price" v-model="price" suffix=" Ariary" :invalid="errors.price ? true : false"/>
                    <small class="errorMessage">{{ errors.price }}</small>
                </div>
                <div class="input">
                    <label for="technicalSpecification">Specification téchnique</label>
                    <Textarea name="technicalSpecification" id="technicalSpecification" v-model="technicalSpecification"/>
                    <small class="errorMessage">{{ errors.technicalSpecification }}</small>
                </div>

                <div class="BTN">
                    <Button type="button" label="Confirmer" class="btn1" @click="editInformation"></Button>
                    <Button type="button" label="Annuler" severity="secondary" @click="editInformationDialogVisible = false"></Button>
                </div>
                </form>
            </Dialog>

            <Dialog v-model:visible="changeProfilePictureDialogVisible" modal header="Mettre à jour photo de présentation" :draggable="false" :style="{width: '25rem'}" @hide="handlePdpReset">
                <form class="changeProfilePicture">
                    <div class="input file">
                        <label for="profilePicture">Photo de présentation : </label>
                        <small class="errorMessage">{{ pdpErrors.profilePicture }}</small>
                        <FileUpload name="profilePicture" id="profilePicture" mode="basic" accept="image/*" @select="onProfilePictureSelect" :maxFileSize="10000000">
                        </FileUpload>
                        <img v-if="profilePicture" :src="profilePicture as string" alt="Image" style="filter: grayscale(100%); width: 200px;" />
                    </div>
                    <div class="BTN">
                        <Button type="button" label="Confirmer" class="btn1" @click="changeProfilePicture"></Button>
                        <Button type="button" label="Annuler" severity="secondary" @click="changeProfilePictureDialogVisible = false"></Button>
                    </div>
                </form>
            </Dialog>

            <Dialog v-model:visible="changeOtherPictureDialogVisibles" modal header="Mettre à jour photo de présentation" :draggable="false" :style="{width: '25rem'}" @hide="src = []">
                <form class="changeOtherPictures">
                    <div class="input file">
                        <label for="otherPictures">Autre photos du matériel</label>
                        <FileUpload name="otherPictures" id="name" mode="basic" :multiple="true" accept="image/*" @select="onOtherPicturesSelect" :maxFileSize="10000000" :file-limit="3">
                        </FileUpload>
                        <img v-for="img in src" :src="img" alt="Image" style="filter: grayscale(100%); width: 200px;" />
                    </div>
                    <div class="BTN">
                        <Button type="button" label="Confirmer" class="btn1" @click="changeOtherPictures"></Button>
                        <Button type="button" label="Annuler" severity="secondary" @click="changeOtherPictureDialogVisibles = false"></Button>
                    </div>
                </form>
            </Dialog>
        </template>
        
        <ConfirmDialog></ConfirmDialog>
    </div>
</template>

<script setup lang="ts">
import { Product, type IProduct } from '@/models/Product';
import { ProductService } from '@/modules/product/product.service';
import Carousel from 'primevue/carousel';
import { onMounted, ref } from 'vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string, number, array } from 'yup';
import { useForm, useField } from 'vee-validate';
import { useToast } from 'primevue/usetoast';
import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload';
import BackButton from '@/components/BackButton.vue';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';
import { useRoute, useRouter } from 'vue-router';

defineOptions({
    inheritAttrs: false
})

const route = useRoute()
const router = useRouter()

const product = ref<Product>()
onMounted(async ()=>{
    product.value = new Product(await ProductService.getOne(+route.params.id))
})

const editInformationDialogVisible = ref<boolean>(false)

const openEditInformationDialog = ()=>{
    editInformationDialogVisible.value = true
    name_product.value = product.value?.name_product
    brand.value = product.value?.brand
    description.value = product.value?.description
    color.value = product.value?.color
    typeId.value = product.value?.typeId
    price.value = product.value?.price
    technicalSpecification.value = product.value?.technicalSpecification
}

const validationSchema = toTypedSchema(
    object({
        name_product: string()
                    .required("Le nom est obligatoire"),
        brand: string()
                    .required("Veuillez remplir ce champ"),
        description: string()
                        .default(''),
        color: string()
                    .default(''),
        typeId: string()
                    .required('Choisir le type du produit est obligatoire')
                    .default(''),
        price: number()
                    .default(0)
                    .min(200, "La valeur est 200 Ar")
                    .required("Remplir le prix"),
        technicalSpecification: string()
                    .default('')
    })
)

const { handleSubmit, handleReset, errors } = useForm({ 
    validationSchema,
});

const { value: name_product } = useField('name_product');
const { value: brand } = useField('brand');
const { value: description } = useField('description');
const { value: color } = useField('color');
const { value: typeId } = useField('typeId');
const { value: price} = useField('price');
const { value: technicalSpecification } = useField('technicalSpecification');

const toast = useToast()
const editInformation = handleSubmit((values)=>{
    if(product.value) ProductService.editInformation(product.value.id as number, values).then((res)=>{
        toast.add({ severity: 'success', summary: 'Modification produit', detail: 'Requête effectuée avec succès', life: 3000 })
        product.value = new Product(res)
        editInformationDialogVisible.value = false
    }).catch((err)=>{
        toast.add({ severity: 'error', summary: 'Modification produit', detail: 'Echec de la requête', life: 3000 })
    })
})

const changeProfilePictureDialogVisible = ref<boolean>(false)

const profilePictureValidationSchema = toTypedSchema(
    object({
        profilePicture: string()
                    .required("Veuillez choisir un")
    })
)

const { handleSubmit: handlePdpSubmit , handleReset: handlePdpReset, errors: pdpErrors } = useForm({ 
    validationSchema: profilePictureValidationSchema
});

const { value: profilePicture } = useField('profilePicture');

const onProfilePictureSelect = (event: FileUploadSelectEvent)=>{
    const file = event.files[0]
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (e) => {
            if(e.target && e.target.result){
                profilePicture.value = e.target.result.toString()
            }
        };
}

const changeProfilePicture = handlePdpSubmit((val)=>{
    if(product.value) ProductService.changeProfilePicture(product.value.id as number, val)
        .then((res)=>{
            toast.add({ severity: 'success', summary: 'Modification produit', detail: 'Requête effectuée avec succès', life: 3000 })
            product.value = new Product(res)
            changeProfilePictureDialogVisible.value = false
        }).catch((err)=>{
            toast.add({ severity: 'error', summary: 'Modification produit', detail: 'Echec de la requête', life: 3000 })
        })
})


const changeOtherPictureDialogVisibles = ref<boolean>(false)

const otherPicturesValidationSchema = toTypedSchema(
    object({
        otherPictures: array().of(string())
                .default([]),
    })
)

const { handleSubmit: handleOtherPicturesSubmit , handleReset: handleOtherPicturespReset, errors: otherPicturesErrors } = useForm({ 
    validationSchema: otherPicturesValidationSchema
});

const { value: otherPhotos } = useField('otherPictures');

const src = ref<string[]>([])
const onOtherPicturesSelect = (event: FileUploadSelectEvent)=>{
    
    src.value = []
    let i = 0;
    event.files.some((file: File) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (e) => {
            if(e.target && e.target.result){
                src.value.push(e.target.result.toString())
            }
        };

        return (i+=1) == 3;
    });
}

const changeOtherPictures = handleOtherPicturesSubmit((val)=>{
    val.otherPictures = src.value
    if(product.value) ProductService.changeOtherPictures(product.value.id as number, val)
        .then((res)=>{
            toast.add({ severity: 'success', summary: 'Modification produit', detail: 'Requête effectuée avec succès', life: 3000 })
            product.value = new Product(res)
            changeOtherPictureDialogVisibles.value = false
        }).catch((err)=>{
            toast.add({ severity: 'error', summary: 'Modification produit', detail: 'Echec de la requête', life: 3000 })  
        })
})

const togglePublishStatus = (value: boolean)=>{
    const val: Partial<IProduct> = {
        isPublished: value
    }
    if(product.value) ProductService.updatePubishStatus(product.value?.id as number, val)
        .then((res)=>{
            if(value){
                toast.add({ severity: 'success', summary: 'Publication de l\'article effectué', detail: 'Le prouit est actuellemet en vente', life: 3000 })
            }else{
                toast.add({ severity: 'success', summary: 'Retrait en vente de l\'article effectué', detail: 'Le produit est n\'est plus en vente sauf dans promotion et pack', life: 3000 }) 
            }
            product.value = new Product(res)
        }).catch((err)=>{
            toast.add({ severity: 'error', summary: 'Modification produit', detail: 'Echec de la requête', life: 3000 }) 
        })
}

const confirm = useConfirm()

const confirmUpdatePublishStatus = (value: boolean)=>{
    confirm.require({
        message: value ? 'Voulez-vous vraiment le mettre en vente?' : 'Voulez-vous vraiment le retirer de la vente?',
        header: 'Confirmation',
        icon: 'pi pi-info-circle',
        rejectProps: {
            label: 'Annuler',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Sauvegarder'
        },
        accept: () => {
            togglePublishStatus(value)
        },
        // reject: () => {
        //     toast.add({ severity: 'error', summary: 'Annulé', detail: 'You have rejected', life: 3000 });
        // }
    });
}

const confirmDeleteProduct = ()=>{
    confirm.require({
        message: 'Voulez vous vraiment supprimer ce produit?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: 'Annuler',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Accepter'
        },
        accept: () => {
            if(product.value) ProductService.delete(product.value?.id as number)
                    .then((res)=>{
                console.log(res)
                        toast.add({ severity: 'error', summary: `Suppression du produit(ID: ${product.value?.id}) effectuée`, life: 3000 });
                        router.go(-1)
                    })
                    .catch((err)=>{
                        toast.add({ severity: 'error', summary: 'Suppression non effectuée', life: 3000 });
                    })
        },
    })
}
</script>

<style>
.editInformation .input, .changeProfilePicture .input{
    display: flex;
    flex-direction: column;
    margin-top: 10px;
}

.editInformation .input p{
    margin: 0;
}

.editInformation .input .errorMessage, .changeProfilePicture .input .errorMessage{
    color: red;
}

.editInformation .BTN, .changeProfilePicture .BTN{
    margin-top: 20px;
    display: flex;
    gap: 10px;
}

.editInformation .BTN .btn1, .changeProfilePicture .BTN .btn1{
    flex-grow: 2;
}

.changeProfilePicture{
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 10px;
}

</style>