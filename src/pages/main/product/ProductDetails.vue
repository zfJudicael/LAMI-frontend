<template>
    <div class="product_details">
        <BackButton />
        <section>
            <div class="photos">
                <h2>{{ product?.name_product }}</h2>

                <div class="presentation">
                    <img :src="product?.getProfileURL()" :alt="`${product?.name_product}.png`">
                </div>

                <Carousel :imgsURL="product?.getOtherPicturesURL()"
                    :item-height-sm="300"
                    :item-width-sm="300"
                    :item-height-md="300"
                    :item-width-md="300"
                />
            
            </div>
            <div class="informations">
                <h2>{{ product?.name_product }}</h2>
                <pre>{{ product?.description }}</pre>
                <h3>Information</h3>
                <p>Marque : {{  product?.brand }}</p>
                <p v-if="product?.color">Couleur disponible : {{ product?.color }}</p>
                <p>Prix unitaire : {{ product?.price.toLocaleString('fr-FR') }} Ariary</p>
                <p>Quantité disponible : {{ product?.availableQuantity }}</p>
                <h3>Spécification technique</h3>
                <pre>{{ product?.technicalSpecification }}</pre>
            </div>
            <div class="order">
                <form @submit.prevent="">
                    <div>
                        <label for="quantity-input">Quantité à commander</label>
                        <InputNumber v-model="quantity" inputId="quantity-input" fluid :showButtons="true" button-layout="horizontal" :step="1" :max="product?.availableQuantity" :min="0">
                            <template #incrementbuttonicon>
                                <span class="pi pi-plus" />
                            </template>
                            <template #decrementbuttonicon>
                                <span class="pi pi-minus" />
                            </template>
                        </InputNumber>
                    </div>
                    <Button type="submit" :disabled="quantity === 0" @click="addToCart">Ajouter au panier</Button>
                </form>
            </div>
        </section>

    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import BackButton from '@/components/BackButton.vue';
import Carousel from '@/components/Carousel.vue';
import { Product } from '@/models/Product';
import { ProductService } from '@/modules/product/product.service';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import { useToast } from 'primevue/usetoast';
import { useCartStore } from '@/stores/cart.store';
import { useAuthStore } from '@/stores/auth.store';

const toast = useToast()

const route = useRoute()
const product = ref<Product>()
onMounted(async ()=>{
    try {
        product.value = new Product(await ProductService.getOne(+route.params.id))
    } catch (error) {}
})

const quantity = ref(0)

const addToCart = ()=>{
    if(useAuthStore().getUser){
        useCartStore().addCartProduct({
            productId: product.value?.id as number,
            productQuantity: quantity.value
        })
        .then(()=> {
            toast.add({ severity: 'success', summary: 'Succès', detail: 'Le matériel est ajouté au panier', life: 3000 })
            quantity.value = 0 
        })
        .catch(()=>{
            toast.add({ severity: 'error', summary: 'Echec', detail: 'Le matériel n\'est pas ajouté au panier', life: 3000 })
        })
    }else{
        toast.add({ severity: 'info', summary: 'Action rejetée', detail: 'Veuillez vous connecter à votre compte', life: 3000 })
    }
}
</script>

<style lang="scss">
.product_details{
    section{
        .photos{
            h2{
                text-align: center;
            }

            .presentation{
                display: flex; 
                justify-content: center;
                margin-top: 10px;

                img{
                    width: 90%;
                }
            }
        }

        .informations{
            h2{
                text-align: center;
            }

            pre{
                white-space: pre-wrap; 
                word-wrap: break-word; 
                font-family: inherit;
            }
        }

        .order{
            margin: 30px 0;
            display: flex; 
            justify-content: center;

            form{
                display: flex; 
                flex-direction: column; 
                gap: 5px; 
                text-align: center;
                width: 80%;

                label{
                    margin-bottom: 5px;
                    display: block;
                }
            }
        }
    }
}

@media only screen and (min-width: 768px){
    .product_details{
        section{
            display: grid; 
            grid-template-columns: repeat(6, 1fr); 
            padding: 5px;
    
            .photos{
                grid-column: 1/4;

                h2{
                    display: none;
                }
    
                .presentation{
                    display: flex; 
                    justify-content: center;
    
                    img{
                        width: 300px;
                    }
                }
            }
    
            .informations{
                grid-column: 4/7;
    
                h2{
                    text-align: center;
                }
    
                pre{
                    white-space: pre-wrap; 
                    word-wrap: break-word; 
                    font-family: inherit;
                }
            }
    
            .order{
                grid-column: 3/5; 
                grid-row: 2;
                display: flex; 
    
                form{
                    display: flex; 
                    flex-direction: column; 
                    gap: 5px; 
                    text-align: center;
                    width: 100%;
                }
            }
        }
    }
}

@media only screen and (min-width: 1024px){
    .product_details{
        section{
            display: grid; 
            grid-template-columns: repeat(6, 1fr); 
            padding: 5px;
    
            .photos{
                grid-column: 1/3;

                h2{
                    display: none;
                }
    
                .presentation{
                    display: flex; 
                    justify-content: center;
    
                    img{
                        width: 300px;
                    }
                }
            }
    
            .informations{
                grid-column: 3/6;
    
                h2{
                    text-align: center;
                }
    
                pre{
                    white-space: pre-wrap; 
                    word-wrap: break-word; 
                    font-family: inherit;
                }
            }
    
            .order{
                grid-column: 6/7; 
                grid-row: 1;
                display: flex; 
    
                form{
                    display: flex; 
                    flex-direction: column; 
                    gap: 5px; 
                    text-align: center
                }
            }
        }
    }
}
</style>