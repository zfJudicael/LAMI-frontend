<template>
    <div class="mainLayout">
        <TopNav/>
        <RouterView class="container"/>
        <Footer />
        <Toast position="bottom-left"/>
    </div>
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
  
<style lang="scss">
.mainLayout{
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    
    .container{
        flex: 1;
        padding: 20px;
    }
}
</style>  