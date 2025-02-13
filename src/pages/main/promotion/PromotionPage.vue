<template>
    <div class="promotion">
        <template v-if="promotionList.length > 0">
            <div v-for="promotion in promotionList" style="border-top: 1px solid black; margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between;">
                    <h3>{{ promotion.namePromotion }}</h3>
                    <p>Fin dans {{ endIn(promotion.end_date) }}</p>
                </div>
    
                <Divider />
                
                <div class="productContainer" style="display: grid; grid-template-columns: repeat( 5, 1fr); gap: 10px; padding: 20px;">
                    <Card  v-for=" productPromo in promotion.product" class="product-item" @click="$router.push({name: 'productDetailsClient', params: { id: productPromo.product.id }})">
                            <template #title>
                                <p style="margin: 0; font-size:medium; text-align: center;">{{ productPromo.product.name_product }}</p>
                            </template>
                            <template #subtitle></template>
                            <template #content>
                                <div style="position: relative;">
                                    <p style="background-color: #0284C7; color: white; text-align: center; position: absolute; top: 0; right: 0; padding: 5px; rotate: 30deg;">Promo</p>
                                    <img :src="productPromo.product.getProfileURL()" :alt="`${productPromo.product.name_product}.png`" width="100%" height="200px">
                                    <s style="margin: 0;">{{ productPromo.product.price.toLocaleString() }} Ariary</s>
                                    <p style="margin-top: 5px; margin-bottom: 0; font-weight: bolder;">{{ reducedPrice(productPromo.product.price, promotion.discount).toLocaleString('fr-FR') }} Ariary</p>
                                </div>
                            </template>
                            <template #footer></template>
                    </Card>
                </div>
            </div>
        </template>
        <template v-else>
            <div style="text-align: center;">
                <p>Aucune promotion est en cours pour le moment.</p>
                <p>Consultez régulièrement cette page pour ne pas en rater.</p>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card';
import Divider from 'primevue/divider';
import { onMounted, ref } from 'vue';
import { PromotionService } from '@/modules/promotion/promotion.service';
import type { IPromotion } from '@/models/Promotion';
import { Product } from '@/models/Product';
import { endIn } from '@/use/useEndIn';

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
    PromotionService.getActivePromotion()
        .then((res)=>{
            res.forEach((promotion)=>{
                if(!promotion.promotionProducts?.length) return

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

const reducedPrice = (price: number, discount: number)=>{
    return price - (price * (discount / 100))
}

</script>