import { defineStore } from 'pinia'
import type { ICart, ICartPack, ICartProduct } from '@/models/Cart'
import { ref } from 'vue'
import { CartService } from '@/modules/cart/cart.service'
import { useAuthStore } from './auth.store'
import type { ICartResponse } from '@/interfaces/ApiResponse'
import { CartProductService } from '@/modules/cart/cartProduct/cart-product.service'
import { Product } from '@/models/Product'
import type { IPack } from '@/models/Pack'
import { CartPackService } from '@/modules/cart/cartPack/cart-pack.service'

interface ICartProductFull {
  productQuantity: number,
  product: Product
}


export const useCartStore = defineStore('cart', {
  state: ()=>({
    myCart: ref<ICart>(),
    cartProducts: ref<ICartProductFull[]>([]),
    cartPacks: ref<ICartPack[]>([])
  }),
  actions: {
    async refreshMyCart(){
      try {
        await this.getCart()
      } catch (error) {
        useAuthStore().logOut()
      }
    },

    async getCart(){
      try {
        let cart: ICartResponse = await CartService.getOne()

        if(!cart.data[0]) cart = await CartService.create()        
        this.myCart = cart.data[0]

        this.cartProducts = []
        cart.data[0].cartProducts?.forEach((value)=>{
          if(value.product){
            this.cartProducts.push({
              productQuantity: value.productQuantity,
              product: new Product(value.product)
            })
          }
        })

        this.cartPacks = []
        cart.data[0].cartPacks?.forEach((value)=>{
          this.cartPacks.push(value)
        })
        
      } catch (error) {
        console.log(error)
      }
    },

    async addCartProduct(params: {
      productId: number,
      productQuantity: number
    }){
      try {
        await CartProductService.create({
          cartId: this.myCart?.id as number,
          productId: params.productId,
          productQuantity: params.productQuantity
        })
        await this.refreshMyCart()

      } catch (error) {
        throw new Error()
      }
    },

    async removeCartProduct(productId: number){
      try {
        await CartProductService.delete(this.myCart?.id as number, productId)

        this.refreshMyCart()
      } catch (error) {
        throw new Error()  
      }
    },

    async updateProductQuantity(productId: number, productQuantity: number){
      try {
        await CartProductService.update({
          cartId: this.myCart?.id as number,
          productId ,
          productQuantity
        })

        this.refreshMyCart()
      } catch (error) {
        throw new Error()
      }
    },

    async addCartPack(params: {
      packId: number,
      packQuantity: number
    }){
      try {
        await CartPackService.create({
          cartId: this.myCart?.id as number,
          packId: params.packId,
          packQuantity: params.packQuantity
        })

        await this.refreshMyCart()
      } catch (error) {
        throw new Error()
      }
    },

    async removeCartPack(packId: number){
      try {
        await CartPackService.delete(this.myCart?.id as number, packId)

        this.refreshMyCart()
      } catch (error) {
       throw new Error() 
      }
    },

    async updatePackQuantity(packId: number, packQuantity: number){
      try {
        await CartPackService.update({
          cartId: this.myCart?.id as number,
          packId ,
          packQuantity
        })

        this.refreshMyCart()
      } catch (error) {
        throw new Error()
      }
    },
    async clearCart(){
      try {
        await CartService.clear(this.myCart?.id as number)

        this.refreshMyCart()
      } catch (error) {
        throw new Error()
      }
    },
    async validateCart(){
      try {
        await CartService.validate(this.myCart?.id as number)

        await this.refreshMyCart()
      } catch (error: any) {
        await this.refreshMyCart()
        
        throw(error)
      }
    }
  },
  getters: {
    getLength: (state)=>{
      let count = 0
      let cartPackLength = (state.myCart?.cartPacks?.length) ? state.myCart?.cartPacks?.length : 0
      let cartProductLength = (state.myCart?.cartProducts?.length) ? state.myCart?.cartProducts.length : 0

      return count + cartPackLength + cartProductLength
    },
    getCartProducts: (state)=>{
      return state.cartProducts
    },
    getCartPacks: (state)=>{
      return state.cartPacks
    },
    getProduct: (state)=>{
      return (productId: number)=>{
        return state.cartProducts.filter((cartProduct)=>{
          return cartProduct.product.id == productId
        })
      }
    },
    getPack: (state)=>{
      return (packId: number)=>{
        return state.cartPacks.filter((cartPack)=>{
          return cartPack.pack?.id == packId
        })
      }
    }

  }
})
