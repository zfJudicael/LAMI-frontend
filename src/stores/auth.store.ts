import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AuthenticatedUser } from '@/models/User'
import { AuthService } from '@/modules/auth/auth.services'
import router from '@/router'
import { useCartStore } from './cart.store'
import { socket } from '@/socket'

export const useAuthStore = defineStore('auth', {
  state: ()=>({
    user: ref<AuthenticatedUser>(),
  }),
  actions: {
    async init(){
      try {
        if(AuthService.getToken()){
          this.user = new AuthenticatedUser(await AuthService.getMe())
        }
      } catch (error) {
        // router.push({name: 'home'})
      }
    },
    async redirect(){
      if(this.user){
        router.push({name: this.user.handleRole()})
        if(this.getUser?.role == 'CLIENT') await useCartStore().refreshMyCart()
        else socket.connect()
      }else{
        router.push({name: 'home'})
      }
    },
    logOut(){
      this.user = undefined
      this.redirect()
    }
  },
  getters: {
    getUser: (state)=>{
      return state.user
    }
  }
})
