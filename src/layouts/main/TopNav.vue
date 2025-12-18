<template>
    <div class="header">
        <div class="top">
            <div class="logo" @click="goTo('home')">
                <img :src="StaticFile.logo" alt="L'AMInformatique">
            </div>
            <div class="search">
                <form @submit.prevent="searchProduct">
                    <InputGroup>
                        <InputText placeholder="Que cherchez-vous?" v-model="searchInput"/>
                        <Button type="submit" icon="pi pi-search"/>
                    </InputGroup>
                </form>
            </div>
            <div v-if="authStore.getUser" class="cart">
                <Button @click="$router.push({name: 'cartPage'})" severity="info" size="small" rounded outlined>
                    <i class="pi pi-shopping-cart"></i>
                    <span class="label">Panier</span>
                    <Badge :value="useCartStore().getLength.toString()" severity="info"></Badge>
                </Button>
            </div>
            <div class="account">
                <Button @click="showDrawer = !showDrawer" rounded severity="success" size="small" outlined>
                    <i class="pi pi-user"></i>
                    <span>Compte</span>
                </Button>
            </div>
        </div>

        <div class="burger_menu">
            <Button icon="pi pi-bars" @click="toggleMenuDrawerVisibility"/>
        </div>
      
        <ul class="navbar">
            <li class="dropdown_button" @click="goTo('home')">
                <div class="menu_item" :class="{'active': isRouteStartWith('home')}">
                    <i class="pi pi-home"></i>
                    TOUS NOS PRODUITS
                    <i class="pi pi-chevron-down chevron" ></i>

                    <ul class="dropdown">
                        <li class="dropdown-item" v-for="category in categoryList" @click="selectCategory(category.id)">
                            <a>
                                {{ category.name_categ }}
                            </a>
                        </li>
                    </ul>
                </div>
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

    <Drawer v-model:visible="isMenuDrawerVisible" position="right" class="menuDrawer">
        <ul>
            <li @click="goTo('home').then(toggleMenuDrawerVisibility)" :class="{'active': isRouteStartWith('home')}">
                <i class="pi pi-home"></i> 
                <span>Tous nos produits</span>
            </li>
            <li @click="goTo('pack').then(toggleMenuDrawerVisibility)" :class="{ 'active' : isRouteStartWith('pack')}">
                <i class="pi pi-wrench"></i>
                <span>Pack matériels</span>
            </li>
            <li @click="goTo('promotion').then(toggleMenuDrawerVisibility)" :class="{'active': isRouteStartWith('promotion')}">
                <i class="pi pi-sparkles"></i>
                <span>Promotions</span>
            </li>
            <li @click="goTo('news').then(toggleMenuDrawerVisibility)" :class="{'active': isRouteStartWith('news')}">
                <i class="pi pi-percentage"></i>
                <span>Nouveautés</span>
            </li>
            <li @click="goTo('help').then(toggleMenuDrawerVisibility)" :class="{'active': isRouteStartWith('help')}">
                <i class="pi pi-question"></i>
                <span>Besoin d'aide</span>
            </li>
        </ul>
    </Drawer>

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
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import { goTo } from '@/use/useGoTo';
import Drawer from 'primevue/drawer';
import Badge from 'primevue/badge';
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
import { StaticFile } from '@/constants/staticfiles';

const categoryList = ref<ICategory[]>([])
onMounted(()=>{
    window.addEventListener('scroll', handleScroll)
    CategoryService.getAll()
        .then((res)=>{
            categoryList.value = res
        })
        .catch((err)=>{})
})

onUnmounted(()=>{
    window.removeEventListener('scroll', handleScroll)
})

const prevScrollPosition = ref<number>(window.scrollY)
const handleScroll = ()=>{
    let currentScrollPosition = window.scrollY
    const header = document.getElementsByClassName('header')[0] as HTMLElement

    if(prevScrollPosition.value > currentScrollPosition ){
        if(currentScrollPosition >= header.offsetHeight){
            header.style.position = "sticky"
            header.style.top = '0px'
        }else header.style.position = "static"
    }else{
        if(currentScrollPosition >= header.offsetHeight){
            header.style.top = `-${header.offsetHeight}px`
        }else header.style.position = "static"
    }
    prevScrollPosition.value = currentScrollPosition
}

const isMenuDrawerVisible = ref<boolean>(false)
const toggleMenuDrawerVisibility = ()=>{
    isMenuDrawerVisible.value = !isMenuDrawerVisible.value
}

const authStore = useAuthStore()

const route = useRoute();
const router = useRouter()

const isRouteStartWith = (routeName: string)=>{
    return route.name?.toString().startsWith(routeName)
}

const selectCategory = async (categoryId: number)=>{
    if(route.name != 'home') {
        await router.push({ name: 'home'})
        await nextTick()
        
        scrollToCategoty(categoryId)
    }else scrollToCategoty(categoryId)
       
}

const scrollToCategoty = (categoryId: number)=>{
    const element = document.getElementById(categoryId.toString())
    if(element) element.scrollIntoView({ behavior: 'smooth'})
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

<style lang="scss">
.header{
    z-index: 5;
    background-color: white;
    .top{
        padding: 5px;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: 1fr 1fr;
        align-items: center;
        text-align: center;

        .logo{
            grid-column: 1 / 3;
            grid-row: 1;

            img{
                width: 90%;
                max-height: 80px;
            }

            &:hover{
                cursor: pointer;
            }
        }

        .search{
            grid-column: span 5;
            grid-row: 2;
            padding: 0 15px;
        }

        .cart{
            grid-column: 4 / 5;
            grid-row: 1;
            display: flex;
            justify-content: end;
            padding-right: 5px;

            .label{
                display: none;
            }
        }

        .account{
            grid-column: 5 / 6;
            grid-row: 1;
        }
    }

    .burger_menu{
        padding: 5px;
        background-color: #6df7c8;
    }

    .navbar{
        display: none;
    }

}

.menuDrawer{
    ul{
        padding: 0;
        li{
            list-style: none;
            padding: 10px;
            display: flex;
            gap: 10px;
            align-items: center;

            &.active{
                color: #10b981;
            }
        }
    }
}

@media only screen and (min-width: 768px){
    .header {
        position: static;
        top: 0;
        background-color: white;
        transition: all 1s ease;

        .top{
            grid-template-columns: repeat(8, 1fr);
            grid-template-rows: 1fr;
            
            .logo {
                grid-column: 1/3;
                
                img{
                    height: auto;
                    width: 100%; 
                }
            }

            .search{
                grid-column: 4/7;
                grid-row: 1;
            }

            .cart{
                grid-column: 7/8;
            }

            .account{
                grid-column: 8/9;
            }
        }

        .burger_menu{
            display: none;
        }

        .navbar{
            background-color: #6df7c8;
            list-style: none;
            display: grid;
            margin: 0;
            padding: 0;
            grid-template-columns: repeat(5, 1fr);

            .dropdown_button{
                position: relative;

                .menu_item{

                    .chevron{
                        transition:all 0.4s ease-in-out;
                    }

                    .dropdown{
                        overflow: hidden;
                        max-height: 0;
                        position: absolute;
                        top: 100%;
                        list-style: none;
                        padding: 0;
                        width: 100%;
                        z-index: 2;
                        transition: max-height 0.5s ease-in-out;

                        
                        .dropdown-item{
                            width: 100%;
                            padding: 10px 50px;
                            background-color: #6df7c8;
                            font-weight: normal;
                            text-align: left;

                            a{
                                font-style: none;
                                font-size:medium;
                                color: black;
                                text-decoration: none;
                            }

                            &:hover{
                                background-color: #10b981;
                                font-weight: bold;

                                a{
                                    color: white;
                                }
                            }

                        }
                    }

                    &:hover{
                        .chevron{
                            rotate: 180deg;
                        }

                        .dropdown{
                            max-height: 300px;
                        }
                    }
                }


            }
            
            .menu_item{
                padding: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 5px;
                transition: all 200ms ease;

                &:hover , &.active{
                    background-color: #10b981;
                    color: white;
                    font-weight: bolder;
                    cursor: pointer;
                }
            }
        }
    }
}

@media only screen and (min-width: 1024px){
    .header {
        .top{
            grid-template-columns: repeat(12, 1fr);
            grid-template-rows: 1fr;
            
            .logo {
                grid-column: 1/3;
                
                img{
                    height: auto;
                    max-width: 100%; 
                }
            }

            .search{
                grid-column: 5/9;
                grid-row: 1;
            }

            .cart{
                grid-column: 11/12;
            }

            .account{
                grid-column: 12/13;
            }
        }
    }
}

</style>