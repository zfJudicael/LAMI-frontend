<template>
    <div class="admin-layout">
        <div class="sidebar" ref="sidebar">
            <img src="../../assets/logo_lami_png.png" alt="logo_lami">
            <ul>
                <li :class="{'active': isRouteStartWith('adminDashboard')}" @click="goTo('adminDashboard')">
                    <i class="pi pi-home"></i> Dashboard
                </li>
                <li :class="{'active': isRouteStartWith('product') || isRouteStartWith('newProduct') }" @click="goTo('product')">
                    <i class="pi pi-list"></i>Produits
                </li>
                <li :class="{'active': isRouteStartWith('pack') || isRouteStartWith('newPack')}" @click="goTo('packAdminPage')">
                    <i class="pi pi-wrench"></i>Pack
                </li>
                <li :class="{'active': isRouteStartWith('promotion') || isRouteStartWith('newPromotion')}" @click="goTo('promotionAdminPage')">
                    <i class="pi pi-percentage"></i>Promotion
                </li>
                <li :class="{'active': isRouteStartWith('order')}" @click="goTo('order')">
                    <i class="pi pi-credit-card"></i>Commande
                </li>
                <li :class="{'active': isRouteStartWith('payment')}" @click="goTo('payment')">
                    <i class="pi pi-wallet  "></i>Payement
                </li>
                <li v-if="useAuthStore().getUser?.role === Role.ADMIN" :class="{'active': isRouteStartWith('user')}" @click="goTo('user')">
                    <i class="pi pi-user"></i>Utilisateurs
                </li>
            </ul>
        </div>
        <div class="admin-content">
            <div class="topnav">
                <Button icon="pi pi-bars" class="burger-button" severity="success" rounded aria-label="Burger-button" @click="openSidebar"/>
                <Avatar icon="pi pi-user" size="large" shape="circle" @click="openPop"/>
                <Popover ref="op"></Popover>
            </div>
            <RouterView class="view"/>
        </div>
        <div class="layout-mask" ref="layout-mask" @click="closeSidebar"></div>
    </div>
    <Toast position="bottom-right"/>
</template>
  
<script setup lang="ts">
import Button from 'primevue/button';
import { useTemplateRef } from 'vue';
import { useRoute } from 'vue-router';
import { goTo } from '../../use/useGoTo';
import Avatar from 'primevue/avatar';
import Popover from 'primevue/popover';
import Toast from 'primevue/toast';
import { useAuthStore } from '@/stores/auth.store';
import { Role } from '@/models/User';

const route = useRoute()
const isRouteStartWith = (routeName: string)=>{
    return route.name?.toString().startsWith(routeName)
}

const sidebar= useTemplateRef('sidebar');
const layoutMask = useTemplateRef('layout-mask');

const openSidebar = ()=>{
    if(sidebar.value) sidebar.value.style.width = '250px';

    if(layoutMask.value) layoutMask.value.style.display = 'block';
}

const closeSidebar = ()=>{
    if(sidebar.value) sidebar.value.style.width = '0';

    if(layoutMask.value) layoutMask.value.style.display = 'none';
}

const handleResize = () => {
    if(window.innerWidth >= 765) {
        if(layoutMask.value) layoutMask.value.style.display = 'none';

        if(sidebar.value) sidebar.value.style.width = '20%';
    }else{
        if(sidebar.value && layoutMask.value){
            sidebar.value.style.width = '0px';
            layoutMask.value.style.display = 'none'
        }
    };
}

window.addEventListener('resize', handleResize)

const op = useTemplateRef('op')

const openPop = (event: Event)=>{
    op.value?.toggle(event)
}
</script>
  
<style>
.admin-layout{
    display: block;
}

.admin-layout .sidebar{
    height: 100vh;
    width: 0;
    position: fixed;
    top: 0;
    z-index: 3;
    background-color: #6DF7C8;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: all 0.5s;
}

.admin-layout .sidebar img{
    width: 80%;
}

.admin-layout .sidebar ul{
    list-style: none;
    padding: 0;
    width: 90%;
}

.admin-layout .sidebar ul li{
    padding: 10px;
    margin: 5px 0;
    transition: all 0.5s;
    display: flex;
    gap: 5px;
}


.admin-layout .sidebar ul li:hover, .admin-layout .sidebar ul li.active{
    cursor: pointer;
    padding: 15px;
    background-color: #10B981;
    color: white;
    font-weight: bold;
}

.admin-layout .admin-content .topnav{
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.admin-layout .admin-content .topnav .p-avatar{
    cursor: pointer;
}

.admin-layout .admin-content{
    background-color: #F1F5F9;
    padding: 20px;
}

.admin-layout .layout-mask{
    display: none;
    background-color: rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;
}

@media only screen and (min-width: 765px) {
    .admin-layout{
        display: flex;
    }

    .admin-layout .layout-mask{
        display: none;
    }

    .admin-layout .sidebar{
        width: 20%;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
    }

    .admin-layout .sidebar img{
        width: 80%;
    }

    .admin-layout .admin-content{
        flex-grow: 1;
        height: 100vh;
        overflow-y: scroll;
    }

    .admin-layout .admin-content .topnav{
        justify-content: end;
    }

    .admin-layout .admin-content .topnav .burger-button{
        display: none;
    }
}

</style>