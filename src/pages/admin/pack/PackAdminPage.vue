<template>
    <div class="packAdminPage">
        <Button label="Ajouter nouveau" icon="pi pi-plus-circle" iconPos="right" @click="goTo('newPack')" size="small" rounded/>

        <table style="width: 100%; text-align: center">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nom de la pack</th>
                    <th>Prix</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="pack in packList">
                    <td>{{ pack.id }}</td>
                    <td>{{ pack.namePack }}</td>
                    <td>{{ pack.pricePack.toLocaleString("fr-FR") }} Ar</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import { goTo } from '@/use/useGoTo';
import { onMounted, ref } from 'vue';
import { PackService } from '@/modules/pack/pack.service';
import type { IPack } from '@/models/Pack';


const packList = ref<IPack[]>([])
onMounted(()=>{
    refreshPackList()
})

const refreshPackList = ()=>{
    packList.value = []
    PackService.getAll()
        .then((res)=>{
            packList.value = res
        })
        .catch((err)=>{})
}

// const deletePack = (packId: number)=>{
//     try {
//         PackService.delete(packId)
//     } catch (error) {
//         console.log(error)
//     }
// }

</script>