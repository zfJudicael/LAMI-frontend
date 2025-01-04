<template>
    <div class="promotionAdmin">
        <Button label="Ajouter nouveau" icon="pi pi-plus-circle" iconPos="right" @click="goTo('newPromotion')" size="small" rounded/>

        <Accordion value="0" style="margin-top: 20px;">
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
                    <div>
                        <p>Détails des matériels concernés</p>
                    </div>
                </AccordionContent>
            </AccordionPanel>
        </Accordion>
    </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import { goTo } from '@/use/useGoTo';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import { onMounted, ref } from 'vue';
import type { IPromotion } from '@/models/Promotion';
import { PromotionService } from '@/modules/promotion/promotion.service';
import { format } from 'date-fns';
import { Product } from '@/models/Product';

interface IPromotionFull extends IPromotion{
    product?: Product[]
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

                let productList: Product[] = []
                promotion.promotionProducts?.map((promotionProduct)=>{
                    if(promotionProduct?.product) productList.push(new Product(promotionProduct.product))
                })

                promotionList.value.push({
                    id: promotion.id,
                    namePromotion: promotion.namePromotion,
                    discount: promotion.discount,
                    start_date: promotion.start_date,
                    end_date: promotion.end_date,
                    product: productList
                })
            })
        })
        .catch((err)=>{})
}


const formatDate = (inputDate: Date): string=>{
    return format(inputDate, 'dd/MM/yyyy HH:mm')
}
</script>