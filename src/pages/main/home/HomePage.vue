<template>
    <div class="home">
        <div class="loading" v-if="loadingProductList">
            <div class="type">
                <Skeleton style="width: 250px;" height="40px"/>
            </div>
            <div v-for="i in 2">
                <Skeleton style="width: 200px; margin: 10px 0; height: 25px;"/>
                <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                    <Skeleton v-for="i in 5" borderRadius="16px" style="width: 100px; height: 35px;"/>
                </div>
                <div class="productContainer">
                    <ProductSkeleton v-for="i in windowWidth <= 768 ? 6 : 10 "/>
                </div>
            </div>
        </div>

        <div class="content" v-else>
            <div class="type">
                <div style="width: 300px;">
                    <Select v-model="selectedPriceFilter" :options="priceFilter" optionLabel="name" placeholder="Select a City" class="w-full md:w-56" @change="loadProductSection"/>
                </div>
            </div>

            <div class="productSection" v-for="(productSection, productSectionIndex) in ProductSection" :id="productSection.category.id.toString()">
                <h3 class="name">{{ productSection.category.name_categ }}</h3>
                <div class="typeFilter">
                    <Chip label="Tout" @click="refreshProductList(productSectionIndex, productSection.category.id)" style="cursor: pointer;"></Chip>
                    <Chip v-for="(type, typeIndex) in productSection.category.types" :label="type" @click="filterProductListByType(productSectionIndex, productSection.category.id, typeIndex)" style="cursor: pointer; "></Chip>
                </div>
                
                <ProductContainer :products="productSection.products"/>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import type { ICategory } from '@/models/Category';
import { Product } from '@/models/Product';
import { CategoryService } from '@/modules/category/category.service';
import { ProductService } from '@/modules/product/product.service';
import { onMounted, onUnmounted, ref } from 'vue';
import Chip from 'primevue/chip';
import ProductContainer from '@/components/ProductContainer/ProductContainer.vue';
import Select from 'primevue/select';
import ProductSkeleton from '@/components/skeleton/ProductSkeleton.vue';
import Skeleton from 'primevue/skeleton';


const loadingProductList = ref<boolean>(false)

const windowWidth = ref<number>(window.innerWidth)

const handleResize = ()=>{
    windowWidth.value = window.innerWidth
}

const priceFilter = ref([
    {name: 'Prix dans l\'order croissant', code: 'ASC'},
    {name: 'Prix dans l\'order décroissant', code: 'DESC'}
])
const selectedPriceFilter = ref(priceFilter.value[0])

interface IProductSection {
    category: ICategory,
    products?: Product[]
}
const ProductSection = ref<IProductSection[]>([])

onMounted(async ()=>{
    window.addEventListener('resize', handleResize);
    try {
        loadingProductList.value = true
        await loadProductSection()
    } catch (error) {}
    finally{
        loadingProductList.value = false
    }
})

onUnmounted(()=>{
    window.removeEventListener('resize', handleResize);
})

const loadProductSection = async ()=>{
    for(let promise of [loadCategoryList, loadProductList]){
        await promise()
    }
}
////////Promise 01
const loadCategoryList = async ()=>{
    return CategoryService.getAll()
        .then((res)=>{
            res.map((val)=>{
                ProductSection.value.push({
                    category: val
                })
            })
        })
        .catch((err)=>{})
}

////////Promise 02
const loadProductList = async ()=>{
    for(const productSectionItem of ProductSection.value){
        try {
            const products = await ProductService.getPublishedByCategory(productSectionItem.category.id, selectedPriceFilter.value.code)
            productSectionItem.products = []
            products.map((val)=>{
                    productSectionItem.products?.push(new Product(val))
                })
        } catch (error) {}
    }
}


const filterProductListByType = (productSectionIndex: number, categoryId: number, typeIndex: number)=>{
    ProductService.getPublishedByType(categoryId, typeIndex, selectedPriceFilter.value.code)
        .then((res)=>{
            ProductSection.value[productSectionIndex].products = []
            res.map((val)=>{
                ProductSection.value[productSectionIndex].products?.push(new Product(val)) 
            })
        })
        .catch((err)=>{})
}

const refreshProductList = (index: number, categoryId: number)=>{
    ProductService.getPublishedByCategory(categoryId, selectedPriceFilter.value.code)
            .then((product)=>{
                ProductSection.value[index].products = []
                product.map((val)=>{
                    ProductSection.value[index].products?.push(new Product(val))
                })
            }).catch((err)=>{})
}

</script>

<style lang="scss">
.home{
    .loading{
        .type{
            display: flex; 
            justify-content: end;
        }

        .productContainer{
            display: grid; 
            grid-template-columns: repeat( 2, 1fr); 
            gap: 10px; 
            padding: 10px 0;
        }
    }

    .content{
        .type{
            display: flex;
            justify-content: end;
        }

        .productSection{
            .name{
                margin: 10px 0;
            }

            .typeFilter{
                display: flex; 
                gap: 2px; 
                flex-wrap: wrap;
            }

            .productContainer{
                display: grid; 
                grid-template-columns: repeat( 2, 1fr); 
                gap: 5px; 
                padding: 10px 0;

                .product-item{
                    background-color: white; 
                    cursor: pointer;

                    &:hover{
                        box-shadow: 2px 2px 10px grey;
                    }

                    .name_product{
                        margin: 0; 
                        font-size:medium; 
                        text-align: center;
                    }

                    .thumbnail{
                        position: relative;

                        .promo{
                            background-color: #0284C7; 
                            color: white; 
                            text-align: center; 
                            position: absolute; 
                            top: 0; 
                            right: 0; 
                            padding: 5px; 
                            rotate: 30deg;
                        }

                        .img{
                            width:100%;
                            height:180px;
                        }

                        .original_price{
                            margin: 0;
                        }

                        .price{
                            margin-top: 5px; 
                            margin-bottom: 0; 
                            font-weight: bolder;
                        }
                    }
                }
            }
        }
    }
}

@media screen and (min-width: 768px) {
    .home{
        .loading{
            .productContainer{
                display: grid; 
                grid-template-columns: repeat( 5, 1fr); 
                gap: 10px; 
                padding: 20px;
            }
        }

        .content{
            .productSection{
                .name{
                    margin: 10px 0;
                }

                .typeFilter{
                    gap: 5px; 
                }

                .productContainer{
                    grid-template-columns: repeat( 3, 1fr); 
                    gap: 10px; 
                    padding: 20px;

                    .product-item{
                        max-width: 280px; 

                        &:hover{
                            box-shadow: 2px 2px 10px grey;
                        }

                        .thumbnail{

                            .img{
                                height:200px;
                            }

                            .price{
                                margin-top: 5px; 
                            }
                        }
                    }
                }
            }
        }
    }
}

@media screen and (min-width: 992px) {
    .home{
        .content{
            .productSection{
                .productContainer{
                    grid-template-columns: repeat( 5, 1fr); 
                }
            }
        }
    }
}
</style>