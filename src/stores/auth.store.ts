import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AuthenticatedUser } from '@/models/User'
import { AuthService } from '@/modules/auth/auth.services'
import router from '@/router'

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
    redirect(){
      if(this.user){
        router.push({name: this.user.handleRole()})
      }else{
        router.push({name: 'home'})
      }
    }
  },
  getters: {
    getUser: (state)=>{
      return state.user
    }
  }
})
