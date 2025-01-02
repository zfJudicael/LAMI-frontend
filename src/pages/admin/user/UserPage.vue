<template>
    <div class="user-page">
        <Button label="Créer un compte pour personnel" icon="pi pi-plus-circle" iconPos="right" @click="goTo('newUser')" rounded size="small"/>

        <table class="user_table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Prénoms</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Rôle</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users">
                    <td>{{ user.id }}</td>
                    <td>{{ user.name }}</td>
                    <td>{{ user.firstname }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.phoneNumber }}</td>
                    <td>{{ handleRole(user.role) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Button from 'primevue/button';
import { goTo } from '@/use/useGoTo';
import { Role, type IUser } from '@/models/User';
import { UserService } from '@/modules/user/user.service';

const users = ref<IUser[]>([])

onMounted(async ()=>{
    refreshUserList()
})

const refreshUserList = ()=>{
    users.value = []
    UserService.getAll()
        .then((res)=>{
            users.value = res
        })
        .catch((err)=>{})
}

const handleRole = (role: string)=>{
    switch(role) {
        case Role.ADMIN :
            return 'Administrateur'
        case Role.CLIENT :
            return 'Client'
        case Role.STOREMAN :
            return 'Magasinier'
        case Role.COMMERCIAL :
            return 'Commercial'
        default :
            return 'Non spécifié'
    }

} 
</script>

<style>
.user_table{
 text-align: center;
 width: 100%;
}

.user_table thead tr{
    background-color: #10B981;
}

.user_table thead tr th, .user_table tbody tr td{
    padding: 10px;
}

.user_table tbody tr{
  background-color: white;
}

.user_table tbody tr:hover{
    background-color: #f0efef;
    cursor: default;
}
</style>