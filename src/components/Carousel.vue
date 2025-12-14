<template>
    <div class="carousel">
        <div class="carousel-container">
            <Button icon="pi pi-angle-left" severity="secondary" rounded aria-label="Previous" 
                @click="prevImg"
                :disabled="currentIndex <= 0"
            />
            <div class="carousel-view">
                <div id="carousel-track" ref="carouselTrack"
                    :style="{ transform: `translateX(-${currentIndex * itemWidth}px)` }"
                >
                    <div class="carousel-item custom-carousel-item" v-for="imgURL in $props.imgsURL">
                        <img :src="imgURL" alt="otherPhotos.png">
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
import { computed, ref } from 'vue';
const props = defineProps({
    imgsURL: {
        type: Array<string>
    }
})
const itemWidth = ref<number>(300)
const itemHeight = ref<number>(400)
const currentIndex = ref(0)

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
            width: 300px;
            overflow: hidden;
            
            #carousel-track{
                display: flex;
                width: max-content;
                transition: transform 0.5s ease;                

                .carousel-item{
                    width: 300px;
                    height: 300px;
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