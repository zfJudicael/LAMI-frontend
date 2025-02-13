import { io } from 'socket.io-client'
import { useNotificationSound } from './use/useNotificationSound'
import { useNewOrderStore } from './stores/newOrder.store'
const URL = 'http://localhost:3000'

export const socket = io(URL, {
    autoConnect: false
})

socket.on('connect', ()=>{
    socket.emit('logIn')
})

socket.on('newOrderNotification', ()=>{
    useNewOrderStore().addNewOrder()
    useNotificationSound()
})