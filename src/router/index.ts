import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/main/home/HomePage.vue';
import PromotionPage from '@/pages/main/promotion/PromotionPage.vue';
import NewsPage from '@/pages/main/news/NewsPage.vue';
import PackPage from '@/pages/main/pack/PackPage.vue';
import AdminLayout from '@/layouts/admin/AdminLayout.vue';
import AdminDashboard from '@/pages/admin/dashboard/AdminDashboard.vue';
import { useAuthStore } from '@/stores/auth.store';
import { Role } from '@/models/User';
import MainLayout from '@/layouts/main/MainLayout.vue';
import ProductPage from '@/pages/admin/product/ProductPage.vue';
import OrderPage from '@/pages/admin/order/OrderPage.vue';
import PaymentPage from '@/pages/admin/payment/PaymentPage.vue';
import UserPage from '@/pages/admin/user/UserPage.vue';
import NewProduct from '@/pages/admin/product/NewProduct.vue';
import NewUser from '@/pages/admin/user/NewUser.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomePage
        },
        {
          path: '/pack',
          name: 'pack',
          component: PackPage
        },
        {
          path: '/promotion',
          name: 'promotion',
          component: PromotionPage
        },
        {
          path: '/news',
          name: 'news',
          component: NewsPage
        },
        {
          path: '/help',
          name: 'help',
          component: () => import('@/pages/main/help/HelpPage.vue')
        },
        {
          path: '/signUp',
          name: 'signUp',
          component: () => import('@/pages/main/signUP/signUpPage.vue')
        }
      ]
    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        { 
          path: '', 
          name: 'adminDashboard',
          component: AdminDashboard 
        },
        { 
          path: '/product', 
          name: 'product',
          component: ProductPage 
        },
        { 
          path: '/product/new', 
          name: 'newProduct',
          component: NewProduct 
        },
        {
          path: '/product/details/:id',
          name: 'productDetails',
          component: ()=> import('@/pages/admin/product/ProductView.vue')
        },
        { 
          path: '/order', 
          name: 'order',
          component: OrderPage 
        },
        { 
          path: '/payment', 
          name: 'payment',
          component: PaymentPage 
        },
        { 
          path: '/user', 
          name: 'user',
          component: UserPage 
        },
        { 
          path: '/user/new', 
          name: 'newUser',
          component: NewUser 
        }
      ]
    }
  ]
})

// Vérification des rôles et de l'authentification
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.getUser;
  const userRole = authStore.getUser?.role;

  if(to.meta.requiresAuth){
    if(isAuthenticated){
      if(userRole === Role.ADMIN || userRole === Role.COMMERCIAL || userRole === Role.STOREMAN){
        next()
      }else{
        next({name: 'home'})
      }
    }else{
      next({name: 'home'});
    }
  }else{
    next()
  }

  // if (to.meta.requiresAuth && !isAuthenticated) {
  // } else if (to.meta.requiresAdmin && ( (userRole !== Role.ADMIN) || (userRole !== Role.COMMERCIAL) || userRole !== Role.STOREMAN ) ) {
  //   next({name: 'home'}); // Redirige vers la page d'accueil si l'utilisateur n'est pas admin
  // } else {
  //   next();
  // }
});

export default router
