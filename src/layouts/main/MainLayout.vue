<template>
    <TopNav />
    <RouterView class="container"/>
    <Footer />
    <Toast position="bottom-left"/>
</template>
  
<script setup lang="ts">
import { onMounted } from 'vue';
import TopNav from './TopNav.vue';
import Footer from './Footer.vue';
import Toast from 'primevue/toast';
import { useAuthStore } from '../../stores/auth.store';
  
onMounted(() => {
    useAuthStore()
        .init()
        .then(() => {
            useAuthStore().redirect();
        });
});
  
</script>
  
<style>
.container{
    min-height: 500px; 
    padding: 20px;
}
</style>  