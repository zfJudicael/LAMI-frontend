<template>
    <div class="navigation">
        <Button @click="router.go(-1)" size="small" rounded>
            <i class="pi pi-chevron-left"></i>
            <span>Retour</span>
        </Button>
    </div>
</template>   

<script setup lang="ts">
import router from '@/router';
import Button from 'primevue/button';
</script>