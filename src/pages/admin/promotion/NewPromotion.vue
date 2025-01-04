<template>
    <div class="newPromotion">
        <BackButton />
        <div>
            <h3 style="text-align: center;">Création d'une nouvelle promotion</h3>
            <form class="promotionForm" @submit.prevent="onSubmit">
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
                <div class="input">
                    <label for="start_date">Date de début*</label>
                    <DatePicker id="start_date" v-model="start_date" showTime hourFormat="24" showIcon fluid iconDisplay="input" :invalid="errors.start_date ? true : false" dateFormat="dd/mm/yy"/>
                    <small class="errorMessage">{{ errors.start_date }}</small>
                </div>
                <div class="input">
                    <label for="end_date">Fin de la promotion*</label>
                    <DatePicker id="end_date" v-model="end_date" showTime hourFormat="24" showIcon fluid iconDisplay="input" :invalid="errors.end_date ? true : false" dateFormat="dd/mm/yy"/>
                    <small class="errorMessage">{{ errors.end_date }}</small>
                </div>
                <div class="BTN">
                    <Button type="reset" severity="secondary" outlined>Effacer</Button>
                    <Button type="submit">Confirmer</Button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import BackButton from '@/components/BackButton.vue';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string, number, date } from 'yup';
import { useForm, useField } from 'vee-validate';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import DatePicker from 'primevue/datepicker';
import { PromotionService } from '@/modules/promotion/promotion.service';
import { useToast } from 'primevue/usetoast';

const toast = useToast()

const validationSchema = toTypedSchema(
    object({
        namePromotion: string()
                    .required("Ce champ est obligatoire"),
        discount: number()
                .required("Champ réquis")
                .default(1)
                .min(1, 'Minimum 1%')
                .max(99, 'Maximum 99%'),
        start_date: date()
                .required("Veuillez marquez la date de début"),
        end_date: date()
                .min(new Date(), "La date de fin doit être ultérieure à aujourd’hui")
                .required("Veuillez marquez la date de fin")
    })
)

const { handleSubmit, handleReset, errors } = useForm({
    validationSchema
})

const { value: namePromotion } = useField('namePromotion');
const { value: discount } = useField('discount');
const { value: start_date } = useField('start_date');
const { value: end_date } = useField('end_date');

const onSubmit = handleSubmit((values)=>{
    PromotionService.create(values)
        .then((res)=>{
            toast.add({ severity: 'success', summary: 'Ajout d\'une nouvelle promotion', detail: 'Requête effectuée avec succès', life: 3000 })
            handleReset()
        })
        .catch((err)=>{
            toast.add({ severity: 'error', summary: 'Ajout d\'une nouvelle promotion', detail: 'Echec de la requête', life: 3000 })
        })
})

</script>

<style>
.newPromotion .promotionForm .input, .newPromotion .promotionForm .BTN{
    display: flex;
    margin-top: 10px;
    margin-left: auto;
    margin-right: auto;
    max-width: 500px;
}

.newPromotion .promotionForm .input{
    flex-direction: column;
}

.newPromotion .promotionForm .input.file{
    display: block;
}

.newPromotion .promotionForm .input p{
    margin: 0;
}

.newPromotion .promotionForm .input .errorMessage{
    color: red;
}

.newPromotion .promotionForm .BTN {
    gap: 5px;
}

.newPromotion .promotionForm .BTN button:nth-child(1){
    flex-grow: 1;
}

.newPromotion .promotionForm .BTN button:nth-child(2){
    flex-grow: 2;
}
</style>