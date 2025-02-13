import { defineStore } from "pinia";
import { ref } from "vue";

export const useNewOrderStore = defineStore('newOrderStore', {
  state: ()=>({
    newOrder: ref<number>(0)
  }),
  actions: {
    addNewOrder(){
        this.newOrder += 1 
    },
    
    resetNewOrder(){
        this.newOrder = 0
    }
  },
  getters: {
    getNewOrder: (state)=>{
        return state.newOrder
    }
  }
})