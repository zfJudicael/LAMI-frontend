import router from "@/router";

type routeName = 'home' | 'pack' | 'promotion' | 'news' | 'help' | 'adminDashboard' | 'product' | 'newProduct' | 'order' | 'payment' | 'chat' | 'user' | 'newUser' | 'shop' | 'packAdminPage' | 'newPack' | 'promotionAdminPage' | 'newPromotion';

export const goTo = (name: routeName)=>{
    router.push({name})
}
