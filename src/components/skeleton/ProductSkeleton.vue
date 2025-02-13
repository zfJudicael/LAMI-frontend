<template>
    <Card class="product-item">
        <template #title>
            <Skeleton style=""></Skeleton>
        </template>
        <template #content>
            <div style="position: relative;">
                <Skeleton  width="100%" height="200px"></Skeleton>
                <Skeleton style="margin-top: 5px; width: 100px;"></Skeleton>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card';
import Skeleton from 'primevue/skeleton';
</script>