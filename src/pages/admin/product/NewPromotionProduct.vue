<template>
    <div class="newProductPromotion">
        <BackButton />
        <h3 style="text-align: center;">Matériel concerné: {{ product?.name_product }}</h3>
        <form style="width: 400px; margin-left: auto; margin-right: auto;">
            <p style="margin: 0;">Promotion selectionnée</p>
            <Card v-if="selectedPromotion">
                <template #content>
                    <div >
                        <p>{{ selectedPromotion.id }} : {{ selectedPromotion.namePromotion }}</p>
                        <p>Réduction: {{ selectedPromotion.discount }}</p>
                        <p>{{ formatDate(selectedPromotion.start_date) }} -- {{ formatDate(selectedPromotion.end_date) }}</p>
                    </div>
                </template>
            </Card>
            <div style="display: flex; justify-content: center; padding: 5px;">
                <Button label="Choisir" size="small" @click="toggleShowDialog"/>
            </div>
            <div style="width: 300px;">
                <label for="application_date">Date d'application</label><br>
                <DatePicker id="application_date" v-model="applicationDate" showTime hourFormat="24" showIcon fluid iconDisplay="input" dateFormat="dd/mm/yy" :invalid="applicationDateError.status"/>
                <small style="color: red;" v-if="applicationDateError.status">{{ applicationDateError.message }}</small>
            </div>
            <div style="margin-top: 10px; display: flex; gap: 5px;">
                <Button label="Confirmer" style="flex-grow: 2;" :disabled="!selectedPromotion" @click="onSubmit"/>
                <Button label="Annuler" severity="secondary" outlined style="flex-grow: 1;"/>
            </div>
        </form>
        <Dialog v-model:visible="showDialog" header="Liste des produits" modal :draggable="false">
            <div style="display: flex; justify-content: center; align-items: center;">
                <InputText v-model="promotionNameFilter" name="filter" inputId="filter" size="small" placeholder="Filtrer par le nom du matériel"/>
            </div>
            <table class="product_table">
                <thead>
                    <tr>
                        <th rowspan="2">ID</th>
                        <th rowspan="2">Désignation</th>
                        <th rowspan="2">Réduction</th>
                        <th colspan="2">Date</th>
                    </tr>
                    <tr>
                        <th>Début</th>
                        <th>Fin</th>
                    </tr>
                </thead>
                <tbody v-if="promotionListToShow.length > 0">
                    <tr v-for="promotion in promotionListToShow" @click="choosePromotion(promotion)">
                        <th style="padding: 8px;">{{ promotion.id }}</th>
                        <th style="padding: 8px;">{{ promotion.namePromotion }}</th>
                        <th style="padding: 8px;">{{ promotion.discount }} %</th>
                        <th style="padding: 8px;">{{ formatDate(promotion.start_date) }}</th>
                        <th style="padding: 8px;">{{ formatDate(promotion.end_date) }}</th>
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
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import DatePicker from 'primevue/datepicker';
import Card from 'primevue/card';
import { Product } from '@/models/Product';
import { ProductService } from '@/modules/product/product.service';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { IPromotion } from '@/models/Promotion';
import { PromotionService } from '@/modules/promotion/promotion.service';
import { format, isWithinInterval } from 'date-fns';
import { PromotionProductSerive } from '@/modules/promotion/promotionProduct/promotion.product.service';
import { useToast } from 'primevue/usetoast';

const route = useRoute()
const router = useRouter()
const showDialog = ref<boolean>(false)

const toggleShowDialog = ()=>{
    showDialog.value = !showDialog.value
}

const product= ref<Product>()
const promotionList = ref<IPromotion[]>([])
const promotionListToShow = ref<IPromotion[]>([])
const selectedPromotion = ref<IPromotion>()
onMounted(async ()=>{
    try {
        product.value = new Product(await ProductService.getOne(+route.params.productId))
        refreshPromotionList(product.value.id as number)
    } catch (error) {}
})

const refreshPromotionList = (productId: number)=>{
    promotionList.value = []
    promotionListToShow.value = []
    PromotionService.getPromotionNotLinkedToProduct(productId)
        .then((res)=>{
            promotionList.value = res
            promotionListToShow.value = res
        })
        .catch((err)=>{})
}

const promotionNameFilter = ref<string>('')

watch(promotionNameFilter, (newValue, oldValue)=>{
    if(newValue){
        promotionListToShow.value = promotionList.value.filter((promotion)=>{
            return promotion.namePromotion.includes(newValue.toUpperCase())
        })
    }else{
        promotionListToShow.value = promotionList.value
    }
})

const choosePromotion = (promotion: IPromotion)=>{
    selectedPromotion.value = promotion
    toggleShowDialog()
}

const formatDate = (inputDate: Date): string=>{
    return format(inputDate, 'dd/MM/yyyy HH:mm')
}

const applicationDate = ref<Date>()

const applicationDateError = ref({
    status: false,
    message: ''
})

const toast = useToast()

const onSubmit = ()=>{
    if(!applicationDate.value){
        applicationDateError.value.status = true
        applicationDateError.value.message = 'Champ obligatoire'
    }else if(
        selectedPromotion.value &&
        !isWithinInterval(applicationDate.value, {
            start: selectedPromotion.value?.start_date,
            end: selectedPromotion.value?.end_date
        })
    ){
        applicationDateError.value.status = true
        applicationDateError.value.message = `La date choisie doit être comprise entre ${formatDate(selectedPromotion.value.start_date)} et ${formatDate(selectedPromotion.value.end_date)}.`
    }else{
        applicationDateError.value.status = false
        applicationDateError.value.message = ''

        PromotionProductSerive.create({
            promotionId: selectedPromotion.value?.id as number,
            productId: +route.params.productId,
            application_date: applicationDate.value
        })
            .then((res)=>{
                toast.add({ severity: 'success', summary: 'Succès', detail: 'Requête effectuée avec succès', life: 3000 })
                router.go(-1)
            })
            .catch((err)=>{
                toast.add({ severity: 'error', summary: 'Echec', detail: 'Echec de la requête', life: 3000 })
                console.log(err)
            })

    }
}
</script>