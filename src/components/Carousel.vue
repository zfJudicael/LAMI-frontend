<template>
    <div class="carousel">
        <div class="carousel-container">
            <Button icon="pi pi-angle-left" severity="secondary" rounded aria-label="Previous" 
                @click="prevImg"
                :disabled="currentIndex <= 0"
            />
            <div class="carousel-view" ref="carouselView">
                <div id="carousel-track"
                    :style="{ transform: `translateX(-${currentIndex * itemWidth}px)` }"
                >
                    <div class="carousel-item custom-carousel-item" v-for="imgURL in $props.imgsURL" ref="carouselItem">
                        <img :src="imgURL" alt="otherPhotos.png" @load="onImageLoad">
                    </div>
                </div>
            </div>
            <Button icon="pi pi-angle-right" severity="secondary" rounded aria-label="Next" 
                @click="nextImg" 
                :disabled="disableNextButton"
            />
        </div>
        <div class="navigation">
            <i v-for="(item, index) in $props.imgsURL" class="pi pi-circle-fill" :class="{active: index === currentIndex}"></i>
        </div>
    </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import { computed, onMounted, onUnmounted, ref } from 'vue';
const props = defineProps({
    imgsURL: {
        type: Array<string>
    },
    itemHeightSm: {
        type: Number,
        required: false
    },
    itemWidthSm: {
        type: Number,
        required: false
    },
    itemHeightMd: {
        type: Number,
        required: false
    },
    itemWidthMd: {
        type: Number,
        required: false
    },
})

const currentIndex = ref(0)

const itemWidth = ref<number>(300)
const itemHeight = ref<number>(400)

const itemWidthSm = ref<number>(200)
const itemHeightSm = ref<number>(300)

const itemWidthMd = ref<number>(300)
const itemHeightMd = ref<number>(400)
    
const carouselView = ref<HTMLElement>()
const carouselItem = ref<HTMLElement[]>([])

onMounted(()=>{
    window.addEventListener("resize", setItemSize)
})

onUnmounted(()=>{
    window.removeEventListener("resize", setItemSize)
})

const loadedCount = ref<number>(0)
const onImageLoad = ()=>{
    loadedCount.value++
    if(loadedCount.value == props.imgsURL?.length){
        setItemSize()
    }
}

const setItemSize = ()=>{
    let windowWidth = window.innerWidth
    if(windowWidth >= 768){
        console.log("MD")
        if(props.itemHeightMd) itemHeight.value = props.itemHeightMd
        else itemHeight.value = itemHeightMd.value

        if(props.itemWidthMd) itemWidth.value = props.itemWidthMd
        else itemWidth.value = itemWidthMd.value
    }else{
        console.log("SM")
        if(props.itemHeightSm) itemHeight.value = props.itemHeightSm
        else itemHeight.value = itemHeightSm.value

        if(props.itemWidthSm) itemWidth.value = props.itemWidthSm
        else itemWidth.value = itemWidthSm.value
    }

    if(carouselView.value) {
        carouselView.value.style.width = `${itemWidth.value}px`
    }

    if(carouselItem.value.length > 0) {
        carouselItem.value.forEach((item)=>{
            item.style.height = `${itemHeight.value}px`
            item.style.width = `${itemWidth.value}px`
        })
    }
}

const nextImg = ()=>{
    if(props.imgsURL?.length && currentIndex.value < props.imgsURL.length -1 ) currentIndex.value++
}

const prevImg = ()=>{
    if(currentIndex.value > 0) currentIndex.value--
}

const disableNextButton = computed(()=>{
    if(props.imgsURL) return currentIndex.value >= props.imgsURL.length -1
    return true
})
</script>


<style lang="scss">
.carousel{
    overflow: hidden;
    width: fit-content;
    margin: 0 auto;
    
    .carousel-container{
        display: flex;
        align-items: center;
        
        .carousel-view{
            overflow: hidden;
            
            #carousel-track{
                display: flex;
                width: max-content;
                transition: transform 0.5s ease;                

                .carousel-item{
                    padding: 1%;
    
                    img{
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                        border-radius: 5px;
                    }
                }
            }
        }
    }

    .navigation{
        display: flex;
        gap: 5px;
        justify-content: center;
        
        i{
            color: lightgray;
            transition: color 0.8s ease;
            
            &.active{
                color: #10b981;
            }
        }
    }
}
</style>