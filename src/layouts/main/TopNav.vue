<template>
    <div class="header">
        <div class="top">
            <div class="logo" @click="goTo('home')"><img src="../../assets/logo_lami_png.png" alt="L'AMInformatique"></div>
            <div class="search">
                <form @submit.prevent="searchProduct">
                    <InputGroup>
                        <InputText placeholder="Que cherchez-vous?" v-model="searchInput"/>
                        <Button type="submit" icon="pi pi-search"/>
                    </InputGroup>
                </form>
            </div>
            <div v-if="authStore.getUser" class="cart">
                <Button label="Panier" @click="$router.push({name: 'cartPage'})" icon="pi pi-shopping-cart" :badge="useCartStore().getLength.toString()" badge-severity="info" severity="info" size="small" rounded outlined/>
            </div>
            <div class="account">
                <Button label="Compte" icon="pi pi-user" @click="showDrawer = !showDrawer" rounded severity="success" size="small" outlined/>
            </div>
        </div>
      
        <ul class="navbar menu">
            <li class="burger-boutton">
                <i class="pi pi-bars"></i>
            </li>
            <li class="dropdown_button">
                <div class="menu_item" @click="showDropdown = !showDropdown" :class="{'active': isRouteStartWith('home')}">
                    <i class="pi pi-home"></i>
                    TOUS NOS PRODUITS
                    <i v-if="!showDropdown" class="pi pi-chevron-down"></i>
                    <i v-else class="pi pi-chevron-up"></i>
                </div>
                <ul v-if="showDropdown" class="dropdown">
                    <li class="dropdown-item" v-for="category in categoryList">
                        <a :href="`#${category.id}`">
                            {{ category.name_categ }}
                        </a>
                    </li>
                </ul>
            </li>
            <li class="menu_item" @click="goTo('pack')" :class="{ 'active' : isRouteStartWith('pack')}">
                <i class="pi pi-wrench"></i>
                PACK MATÉRIELS
            </li>
            <li class="menu_item" @click="goTo('promotion')" :class="{'active': isRouteStartWith('promotion')}">
                <i class="pi pi-percentage"></i>
                PROMOTIONS
            </li>
            <li class="menu_item" @click="goTo('news')" :class="{'active': isRouteStartWith('news')}">
                <i class="pi pi-sparkles"></i>
                NOUVEAUTÉS
            </li>
            <li class="menu_item help" @click="goTo('help')" :class="{'active': isRouteStartWith('help')}">
                <i class="pi pi-question"></i>
                BESOIN D'AIDE
            </li>
        </ul>
    </div>

    <Drawer v-model:visible="showDrawer" position="right">
        <div v-if="authStore.getUser" class="account" style="text-align: center; padding: 5px;">
            <div class="avatar">
                <img src="../../assets/img/defaultAvatar.png" width="100px" alt="defaultAvatar.png">
            </div>
            <p style="margin: 0; font-weight: bold;">{{ authStore.getUser.getFullName }}</p>
            <p style="margin: 0;">{{ authStore.getUser.email }}</p>
        </div>
        <div v-else class="login" style="padding: 5px;">
            <h3 style="margin: 5px 0;">Connexion</h3>
            <form @submit="onSubmit">
                <div class="mb-2" style="display: flex; flex-direction: column;">
                    <label for="email">Email</label>
                    <InputText id="email" aria-labelledby="email" aria-describedby="email-help" v-model="email" :invalid="errors.email ? true : false"/>
                    <small class="errorMessage">{{ errors.email }}</small>
                </div>
                <div class="mb-3">
                    <label for="password" style="display: block;">Mots de passe</label>
                    <Password id="password" aria-labelledby="password" :feedback="false" toggle-mask v-model="password" :invalid="errors.password ? true : false"/>
                    <small class="errorMessage" style="color: red;">{{ errors.password }}</small>
                </div>
                <div class="flex justify-end gap-2">
                    <Button type="submit" label="Confirmer" style="flex-grow: 1;"></Button>
                    <Button type="button" label="Effacer" severity="secondary" @click="handleReset"/>
                </div>
            </form>
            <p>Vous n'avez pas encore un compte? <RouterLink :to="{name: 'signUp'}" @click="showDrawer = !showDrawer">Cliquez ici</RouterLink></p>
        </div>
        <template #footer v-if="authStore.getUser">
            <div class="flex items-center gap-2">
                <Button label="Se deconnecter" icon="pi pi-sign-out" class="flex-auto" severity="danger" text
                    @click="logOut"
                ></Button>
            </div>
        </template>
    </Drawer>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { goTo } from '@/use/useGoTo';
import Drawer from 'primevue/drawer';
import Button from 'primevue/button';
import InputGroup from 'primevue/inputgroup';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import { useToast } from 'primevue/usetoast';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { AuthService } from '@/modules/auth/auth.services';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string } from 'yup';
import { useField, useForm } from 'vee-validate';
import { CategoryService } from '@/modules/category/category.service';
import type { ICategory } from '@/models/Category';
import { useCartStore } from '@/stores/cart.store';

const categoryList = ref<ICategory[]>([])
onMounted(()=>{
    CategoryService.getAll()
        .then((res)=>{
            categoryList.value = res
        })
        .catch((err)=>{})
})

const authStore = useAuthStore()

const showDropdown = ref<boolean>(false);

const route = useRoute();
const router = useRouter()

const isRouteStartWith = (routeName: string)=>{
    return route.name?.toString().startsWith(routeName)
}

const showDrawer = ref<boolean>(false)


const validationSchema = toTypedSchema(
    object({
        email: string()
                    .required("Veuillez entrer votre email"),
        password: string()
                        .required("Mots de passe")
    })
)

const { handleSubmit, handleReset, errors } = useForm({
    validationSchema
})

const { value: email } = useField('email');
const { value: password } = useField('password');

const toast = useToast()
const onSubmit = handleSubmit((values)=>{
    AuthService.signIn({
        email: values.email,
        password: values.password
    }).then(async (res)=>{
        toast.add({ severity: 'success', summary: 'Info Message', detail: 'Connexion effectuée', life: 3000 })
        AuthService.setToken(res.data)
        handleReset()
        await useAuthStore().init()
        showDrawer.value = false
        return useAuthStore().redirect()
    }).catch((err)=>{
        toast.add({ severity: 'error', summary: 'Info Message', detail: 'Connexion echouée', life: 3000 })
    })
})


const searchInput = ref<string>('')
const searchProduct = ()=>{
    router.push({
        name: 'searchPage',
        query: {
            name_product: searchInput.value.toUpperCase()
        }
    })
}

const logOut = ()=>{
    try {
        AuthService.logOut()
        showDrawer.value = false
    } catch (error) {}
}
</script>

<style>
/* .header{
    position: sticky;
    top: 0;
    left: 0;
    z-index: 3;
    background-color: #fff;
}

.topnav.hidden {
  opacity: 0;
  transform: translateY(-100%);
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
} */

.header .top, .header .navbar{
    margin: 0;
}

/* 
    Top
*/
.header .top{
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: 1fr auto;
    align-items: center;
    text-align: center;
}

.header .logo{
    grid-column: 1 / 3;
    grid-row: 1;
}

.header .logo img{
    width: 100%;
}

.header .block{
    display: none;
}

.header .cart{
    grid-column: 4 / 5;
    grid-row: 1;
}

.header .account{
    grid-column: 5 / 6;
    grid-row: 1;
}

.header .search{
    grid-column: span 5;
    grid-row: 2;
    padding: 0 20px 0 20px;
}

.header .logo:hover{
    cursor: pointer;
}

.search form > div{
    border-radius: 50%;
}

.header .top{
    margin-bottom: 5px;
}

.header .top  p {
    margin: 0;
}

@media only screen and (min-width: 600px){
    .header .top{
        margin-bottom: 10px;
    }
    
    .header .logo img{
        height: auto;
        max-width: 50%; 
    }
}

@media only screen and (min-width: 786px){
    .header .top{
        grid-template-columns: repeat(12, 1fr);
        grid-template-rows: 1fr;
        margin: 0;
    }

    .header .logo{
        grid-column: 1 / 4;
    }

    .header .logo img{
        height: auto;
        max-width: 65%; 
    }

    .header .search{
        grid-column:  5 / 10;
        grid-row: 1;
    }
    
    .header .cart{
        grid-column: 11 / 12;
        text-align: center;
    }

    .header .account{
        grid-column: 12 / 13;
        text-align: center
    }
}


/*********
    navbar
**********/ 
.navbar{
    background-color: #6df7c8;
}

.menu{
    list-style: none;
    display: grid;
    padding-left: 0;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(4, 1fr);
}

.menu .burger-boutton{
    grid-row: 1;
    grid-column: 1 / 3;
    padding: 5px 5px 5px 15px;
    display: flex;
    justify-content: start;
    align-items: center;
    gap: 5px;
}

.menu .menu_item{
    padding: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
}

.menu .burger-boutton:hover, .menu .menu_item:hover, .dropdown .dropdown-item:hover, .menu .active{
    background-color: #10b981;
    color: white;
    cursor: pointer;
}

.menu .dropdown_button{
    position: relative;
}

.menu .dropdown{
    position: absolute;
    top: 100%;
    list-style: none;
    padding-left: 0;
    right: 0;
    z-index: 99;
}

.dropdown .dropdown-item{
    padding: 10px;
    background-color: #6df7c8;
    text-align: left;
}

@media only screen and (min-width: 600px){
    .menu{
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(2, 1fr);
    }

    .menu .burger-boutton{
        display: none;
    }

    .menu .help{
        grid-column: 4 / 5;
    }
}

@media only screen and (min-width: 768px) {
    .menu{
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: repeat(1, 1fr);
    }

    .menu .burger-boutton, .menu .menu_item{
        padding: 15px;
    }

    .menu .help{
        grid-column: 5 / 6;
    }
    
}

</style>