<template>
    <div class="newProduct">
        <h3>Ajout</h3>
        <form class="productForm" @submit.prevent="submitForm" @reset="resetForm">
            <div class="input">
                <p>Catégorie du produit à ajouter </p>
                <Select v-model="selectedCategory" :options="categoryList" optionLabel="name_categ" placeholder="Choisir la category du produit que vous voulez ajouter" class="w-full md:w-56" v-on:update:model-value="refreshTtypeList"/>
            </div>

            <div class="input radio_container">
                <p>Type de produit</p>
                <template v-if="typeList.length > 0">
                    <div class="radio_button" v-for="typeItem in typeList">
                        <RadioButton v-model="typeId" name="type" :inputId="typeItem.id" :value="typeItem.id" size="small"/>
                        <label for="type">{{ typeItem.name_type }}</label>
                    </div>
                </template>
                <template v-else>
                    <small>
                        Aucun type de produit définie dans cette catégorie. Veuillez ajouter pour en benificier d'avantage
                    </small>
                </template>
                <small class="errorMessage">{{ errors.typeId }}</small>
            </div>
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

            <div class="input file">
                <label for="profilePicture">Photo de présentation : </label>
                <small class="errorMessage">{{ errors.profilePicture }}</small>
                <FileUpload name="profilePicture" id="profilePicture" mode="basic" accept="image/*" @select="onProfilePictureSelect" :maxFileSize="10000000">
                </FileUpload>
                <img v-if="profilePicture" :src="profilePicture as string" alt="Image" style="filter: grayscale(100%); width: 200px;" />
            </div>

            <div class="input file">
                <label for="otherPictures">Autre photo du matériel</label>
                <FileUpload name="otherPictures" id="name" mode="basic" :multiple="true" accept="image/*" @select="onOtherPicturesSelect" :maxFileSize="10000000" :file-limit="3">
                    <!-- <template #empty>
                        <span>Drag and drop files to here to upload.</span>
                    </template> -->
                </FileUpload>
                <img v-for="img in src" :src="img" alt="Image" style="filter: grayscale(100%); width: 200px;" />
            </div>

            <div class="input">
                <label for="technicalSpecification">Specification téchnique</label>
                <InputText name="technicalSpecification" id="technicalSpecification" v-model="technicalSpecification" :invalid="errors.technicalSpecification ? true : false"/> 
                <small class="errorMessage">{{ errors.technicalSpecification }}</small>
            </div>

            <div class="input">
                <label for="quantity">Quantité*</label>
                <InputNumber name="quantity" id="quantity" v-model="quantity" :invalid="errors.quantity ? true : false"/> 
                <small class="errorMessage">{{ errors.quantity }}</small>
            </div>

            <div class="BTN">
                <Button type="submit">Enregistrer</Button>
                <Button type="reset" severity="secondary">Effacer</Button>
            </div>

        </form>
    </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';
import RadioButton from 'primevue/radiobutton';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string, number, ref as REF, boolean, array } from 'yup';
import { useForm, useField } from 'vee-validate';
import { onMounted, ref } from 'vue';
import type { ICategory } from '@/models/Category';
import { CategoryService } from '@/modules/category/category.service';
import type { IType } from '@/models/Type';
import { TypeService } from '@/modules/type/type.service';
import { ProductService } from '@/modules/product/product.service';
import { useToast } from 'primevue/usetoast';

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
        profilePicture: string()
                            .required("Veuillez choisir un"),
        otherPictures: array().of(string())
                    .default([]),
        technicalSpecification: string()
                    .default(''),
        quantity: number()
                .required("Remplir le prix unitaire")
                .default(0),
        avaibility: boolean()
                        .default(true),
        isPublished: boolean()
                        .default(false)
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
const { value: profilePicture } = useField('profilePicture');
const { value: otherPictures } = useField('otherPictures');
const { value: technicalSpecification } = useField('technicalSpecification');
const { value: quantity } = useField('quantity');

const selectedCategory = ref<ICategory>()
const categoryList = ref<ICategory[]>([])

const refreshCategoryList = async ()=>{
    try {
        categoryList.value = await CategoryService.getAll()        
    } catch (error) {
        categoryList.value = []
    }
}

onMounted(()=>{
    refreshCategoryList()
})


const typeList = ref<IType[]>([])

const refreshTtypeList = async ()=>{
    try {
        if(selectedCategory.value) typeList.value = await TypeService.getByCategoryId(selectedCategory.value.id)        
    } catch (error) {
        typeList.value = []
    }
}


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

const toast = useToast();
const submitForm = handleSubmit((values)=>{
    values.otherPictures = src.value
    ProductService.create(values)
        .then((res)=>{
            toast.add({ severity: 'success', summary: 'Ajout d\'un nouveau produit', detail: 'Requête effectuée avec succès', life: 3000 })
            resetForm()
        })
        .catch((err)=>{
            toast.add({ severity: 'error', summary: 'Ajout d\'un nouveau produit', detail: 'Echec de la requête', life: 3000 })
        })
})

const resetForm = ()=>{
    handleReset()
    src.value = []
}

</script>

<style>
.newProduct .productForm .input{
    display: flex;
    flex-direction: column;
    margin-top: 10px;
}

.newProduct .productForm .input.file{
    display: block;
}

.newProduct .productForm .input p{
    margin: 0;
}

.newProduct .productForm .input .errorMessage{
    color: red;
}
</style>