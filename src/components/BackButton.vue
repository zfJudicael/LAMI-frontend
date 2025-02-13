<template>
    <div class="navigation">
        <Button @click="router.go(-1)" icon="pi pi-chevron-left" label="Retour" size="small"></Button>
    </div>
</template>   

<script setup lang="ts">
import router from '@/router';
import Button from 'primevue/button';
</script>