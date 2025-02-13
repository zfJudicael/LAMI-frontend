<template>
    <div class="promotionAdmin">
        <Button label="Lancer une nouvelle promotion" icon="pi pi-plus-circle" iconPos="right" @click="goTo('newPromotion')" size="small" rounded/>

        <Accordion :value="0" style="margin-top: 20px;">
            <AccordionPanel v-for="(promotion, index) in promotionList" :key="promotion.id" :value="index">
                <AccordionHeader>{{ promotion.namePromotion }}</AccordionHeader>
                <AccordionContent>
                    <div style="display: flex; justify-content: space-between;">
                        <div>
                            <p>Réduction: {{ promotion.discount }} %</p>
                            <p>Nombre de matériels concernés: {{ (promotion.product) ? promotion.product.length : 0 }}</p>
                        </div>
                        <table border="1px solid black" style="border-collapse: collapse;">
                            <thead>
                                <tr>
                                    <th colspan="2">Date</th>
                                </tr>
                                <tr>
                                    <th>Début</th>
                                    <th>Fin</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style="padding: 5px;">{{ formatDate(promotion.start_date) }}</td>
                                    <td style="padding: 5px;">{{ formatDate(promotion.end_date) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-if="promotion.product?.length">
                        <p>Détails des matériels concernés</p>
                        <Card v-for="productPromo in promotion.product">
                            <template #content>
                                <div style="display : grid; grid-template-columns: repeat(6, 1fr); align-items: center;">
                                    <p>ID : {{ productPromo.product.id }}</p>
                                    <p>{{ productPromo.product.name_product }}</p>
                                    <img :src="productPromo.product.getProfileURL()" width="100%" :alt="`${productPromo.product.name_product}.png`">
                                    <p>Quantité disponible: {{ productPromo.product.availableQuantity }}</p>
                                    <div style="text-align: center;">
                                        <p>Appliqué à partir de {{ formatDate(productPromo.application_date) }}</p>
                                        <Button label="Modifier" size="small" severity="info" icon="pi pi-pen-to-square" @click="openDialog(promotion, productPromo)"/>
                                    </div>
                                    <Button label="Retirer de la liste" size="small" severity="danger" icon="pi pi-trash"
                                    @click="removeConfirmation(promotion.id as number, productPromo.product.id as number)"/>
                                </div>
                            </template>
                        </Card>
                    </div>
                    <div style="display: flex; justify-content: center; margin-top: 10px; gap: 5px;">
                        <Button size="small" rounded icon="pi pi-plus-circle" label="Ajouter un nouveau matériel" @click="$router.push({name: 'product'})"/>
                        <Button size="small" rounded icon="pi pi-trash" label="Modifier la promotion" @click="openEditDialog(promotion)" severity="info" outlined/>
                        <Button size="small" rounded icon="pi pi-trash" label="Supprimer la promotion" @click="deletePromotion(promotion.id as number)" severity="danger" outlined/>
                    </div>
                </AccordionContent>
            </AccordionPanel>
        </Accordion>
        <ConfirmDialog></ConfirmDialog>
        <Dialog v-model:visible="showDialog" modal header="Changement de la date d'application" :draggable="false" :style="{ width: '25rem' }">
            <p>Produit concerné : {{ selectedPromotionProduct?.product.name_product }}</p>
            <form>
                <div class="input" style="display: flex; flex-direction: column; margin-top: 10px;">
                    <label for="application_date">Date d'application*</label>
                    <DatePicker name="application_date" id="application_date" v-model="newApplicationDate" showTime hourFormat="24" showIcon fluid iconDisplay="input" dateFormat="dd/mm/yy" :invalid="applicationDateError.state ? true : false"/> 
                    <small class="errorMessage" style="color: red;">{{ applicationDateError.errorMessage }}</small>
                </div>
                <Divider />
                <div class="BTN">
                        <Button type="button" label="Confirmer" class="btn1" @click="editApplicationDate"></Button>
                        <Button type="button" label="Annuler" severity="secondary" @click="closeDialog"></Button>
                    </div>
            </form>
        </Dialog>
        <Dialog 
            v-model:visible="showEditPromotionDialog" 
            modal 
            header="Mise à jour promotion" 
            :draggable="false" 
            :style="{ width: '25rem' }">
            <form class="editPromotion">
                <div class="input">
                    <label for="namePromotion">Nom de la promotion*</label>
                    <InputText name="namePromotion" id="namePromotion" v-model="namePromotion" :invalid="errors.namePromotion ? true : false"/> 
                    <small class="errorMessage">{{ errors.namePromotion }}</small>
                </div>
                <div class="input">
                    <label for="discount">Pourcentage de réduction*</label>
                    <InputNumber name="discount" id="discount" v-model="discount" :invalid="errors.discount ? true : false" :min="1" :max="99" suffix=" %" show-buttons/> 
                    <small class="errorMessage">{{ errors.discount }}</small>
                </div>
                <div style="display: flex; gap: 5px; margin-top: 5px;">
                    <Button label="Confirmer" style="flex-grow: 2;" @click="onEditPromotionSubmit"/>
                    <Button label="Annuler" @click="showEditPromotionDialog = false" style="flex-grow: 1;" outlined/>
                </div>
            </form>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import { goTo } from '@/use/useGoTo';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Card from 'primevue/card';
import ConfirmDialog from 'primevue/confirmdialog';
import Dialog from 'primevue/dialog';
import DatePicker from 'primevue/datepicker';
import Divider from 'primevue/divider';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import type { IPromotion } from '@/models/Promotion';
import { PromotionService } from '@/modules/promotion/promotion.service';
import { format, isWithinInterval } from 'date-fns';
import { Product } from '@/models/Product';
import { PromotionProductSerive } from '@/modules/promotion/promotionProduct/promotion.product.service';
import { useField, useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { date, number, object, string } from 'yup';

interface IProductPromo {
    application_date: Date,
    product: Product
}
interface IPromotionFull extends IPromotion{
    product?: IProductPromo[]
}
const promotionList = ref<IPromotionFull[]>([])
onMounted(()=>{
    refreshPromotionList()    
})

const refreshPromotionList = ()=>{
    promotionList.value = []
    PromotionService.getAll()
        .then((res)=>{
            res.forEach((promotion)=>{
                let productList: IProductPromo[] = []
                promotion.promotionProducts?.map((promotionProduct)=>{
                    if(promotionProduct?.product) {
                        productList.push({
                            application_date: promotionProduct.application_date,
                            product: new Product(promotionProduct.product)
                        })}
                })

                promotionList.value.push({
                    id: promotion.id,
                    namePromotion: promotion.namePromotion,
                    discount: promotion.discount,
                    start_date: promotion.start_date,
                    end_date: promotion.end_date,
                    promotionProducts: promotion.promotionProducts,
                    product: productList
                })
            })
        })
        .catch((err)=>{})
}


const formatDate = (inputDate: Date): string=>{
    return format(inputDate, 'dd/MM/yyyy HH:mm')
}

const showDialog = ref<boolean>(false)
const selectedPromotion = ref<IPromotion>()
const selectedPromotionProduct = ref<IProductPromo>()
const newApplicationDate = ref<Date>()
const openDialog = (promotion: IPromotion, productPromo: IProductPromo)=>{
    selectedPromotion.value = promotion
    selectedPromotionProduct.value = productPromo
    newApplicationDate.value = productPromo.application_date
    showDialog.value = true
}

const closeDialog = ()=>{
    showDialog.value = false
}

const applicationDateError = ref({
    state: false,
    errorMessage: ''
})
const editApplicationDate = ()=>{
    if(newApplicationDate.value){
        
        if(selectedPromotion.value &&
            isWithinInterval(newApplicationDate.value, {
                start: selectedPromotion.value.start_date,
                end: selectedPromotion.value.end_date
            })
        ){
            applicationDateError.value.state = false
            applicationDateError.value.errorMessage = ''
            PromotionProductSerive.updateApplicationDate(
                selectedPromotion.value.id as number, 
                selectedPromotionProduct.value?.product.id as number, 
                newApplicationDate.value
            ).then((res)=>{
                refreshPromotionList()
                toast.add({ severity: 'success', summary: 'Modification effectuée', life: 3000 });
            }).catch((err)=>{
                toast.add({ severity: 'error', summary: 'Échec de la requête', life: 3000 });
            })
        }else{
            applicationDateError.value.state = true
            applicationDateError.value.errorMessage = `La date choisie doit être comprise entre ${selectedPromotion.value?.start_date} et ${selectedPromotion.value?.end_date}`
        }
        showDialog.value = false
    }else{
        applicationDateError.value.state = true
        applicationDateError.value.errorMessage = 'Champ requis'
    }
}

const confirm = useConfirm();
const toast = useToast();

const removeConfirmation = (promotionId: number, productId: number) => {
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
            PromotionProductSerive.delete(promotionId, productId)
                .then((res)=>{
                    refreshPromotionList()
                    toast.add({ severity: 'success', summary: 'Retiré avec succès', life: 3000 });
                })
                .catch((err)=>{
                    console.log(err)
                    toast.add({ severity: 'error', summary: 'Échec de la requête', life: 3000 });
                })
        },
        reject: () => {}
    });
};

const deletePromotion = (promotionId: number)=>{
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
            PromotionService.deletePromotion(promotionId)
                .then((res)=>{
                    refreshPromotionList()
                    toast.add({ severity: 'success', summary: 'Retiré avec succès', life: 3000 });
                })
                .catch((err)=>{
                    console.log(err)
                    toast.add({ severity: 'error', summary: 'Échec de la requête', life: 3000 });
                })
        },
        reject: () => {}
    });
}

const showEditPromotionDialog = ref<boolean>(false)

const selectedEditPromotion = ref<IPromotion>()
const openEditDialog = (promotion: IPromotion)=>{
    selectedEditPromotion.value = promotion
    namePromotion.value = promotion.namePromotion
    discount.value = promotion.discount
    showEditPromotionDialog.value = true
}

const validationSchema = toTypedSchema(
    object({
        namePromotion: string()
                    .required("Ce champ est obligatoire"),
        discount: number()
                .required("Champ réquis")
                .default(1)
                .min(1, 'Minimum 1%')
                .max(99, 'Maximum 99%'),
    })
)

const { handleSubmit, handleReset, errors } = useForm({
    validationSchema
})

const { value: namePromotion } = useField('namePromotion');
const { value: discount } = useField('discount');


const onEditPromotionSubmit = handleSubmit((values)=>{
    PromotionService.update(selectedEditPromotion.value?.id as number, values)
        .then((res)=>{
            refreshPromotionList()
            showEditPromotionDialog.value = false
            toast.add({ severity: 'success', summary: 'Modification bien effectuée', life: 3000 });
        })
        .catch((err)=>{
            toast.add({ severity: 'error', summary: 'Échec de la modification', life: 3000 });
        })
})
</script>

<style>
.editPromotion .input{
    display: flex;
    flex-direction: column;
    margin-bottom: 5px;
}

.editPromotion .input .errorMessage{
    color: red;
}
</style>