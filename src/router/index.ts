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
import ProductDetails from '@/pages/main/product/ProductDetails.vue';
import PackAdminPage from '@/pages/admin/pack/PackAdminPage.vue';
import NewPack from '@/pages/admin/pack/NewPack.vue';
import PromotionAdminPage from '@/pages/admin/promotion/PromotionAdminPage.vue';
import NewPromotion from '@/pages/admin/promotion/NewPromotion.vue';
import RefundPage from '@/pages/admin/payment/RefundPage.vue';
import SearchPage from '@/pages/main/search/SearchPage.vue';

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
          path: '/product/client/details/:id',
          name: 'productDetailsClient',
          component: ProductDetails
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
        },
        {
          path: '/cart',
          name: 'cartPage',
          component: ()=> import('@/pages/main/cart/CartPage.vue')
        },
        {
          path: '/search',
          name: 'searchPage',
          component: SearchPage
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
          path: '/admin/product', 
          name: 'product',
          component: ProductPage 
        },
        { 
          path: '/admin/product/new', 
          name: 'newProduct',
          component: NewProduct 
        },
        {
          path: '/admin/product/details/:id',
          name: 'productDetailsAdmin',
          component: ()=> import('@/pages/admin/product/ProductView.vue')
        },
        {
          path: '/admin/product/promotion/:productId',
          name: 'newPromotionProduct',
          component: ()=> import('@/pages/admin/product/NewPromotionProduct.vue')
        },
        {
          path: '/admin/pack',
          name: 'packAdminPage',
          component: PackAdminPage
        },
        {
          path: '/admin/pack/new',
          name: 'newPack',
          component: NewPack
        },
        {
          path: '/admin/promotion',
          name: 'promotionAdminPage',
          component: PromotionAdminPage
        },
        {
          path: 'admin/promotion/new',
          name: 'newPromotion',
          component: NewPromotion
        },
        { 
          path: '/admin/order', 
          name: 'order',
          component: OrderPage 
        },
        {
          path: '/admin/order/:id',
          name: 'orderDetails',
          component: ()=> import('@/pages/admin/order/OrderDetails.vue')
        },
        { 
          path: '/admin/payment', 
          name: 'payment',
          component: PaymentPage 
        },
        {
          path: '/admin/refund',
          name: 'refundPage',
          component: RefundPage
        },
        { 
          path: '/admin/user', 
          name: 'user',
          component: UserPage 
        },
        { 
          path: '/admin/user/new', 
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
