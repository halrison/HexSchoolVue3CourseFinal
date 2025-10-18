import { defineStore, storeToRefs } from "pinia"
import { http } from "../util"
import { ref } from "vue"
import useMessageStore from "@/stores/messages"
import useLoadingStore from "@/stores/loading"

export default defineStore(
  'orders',
  () => {
    const orders = ref([])
    const order = ref({})
    const user = ref({})
    const pagination = ref({})
    const { pushMessage } = useMessageStore()
    const { isLoading } = storeToRefs(useLoadingStore())
    
    function addOrder (userInfo, message) {
      http.post(
        `/api/${import.meta.env.VITE_PATH}/order/`,
        {
          data: {
            user: userInfo,
            message
          }
        }
      ).then(function (response) {
        if (response.data.success) { 
          user.value = userInfo
          pushMessage('success', response.data.message) }
      }).catch(function (error) {
        pushMessage('danger', '新增訂單失敗', error?.message)
      })
    }
    function editOrder () {
      order.value.user = user.value
      http.put(
        `/api/${import.meta.env.VITE_PATH}/admin/order/${order.value.id}`,
        { 
          data: order.value 
        }
      ).then(function (response) {
        if (response.data.success) {
          pushMessage('success', response.data.message)
        } else {
          response.data.message.forEach(function (msg) { 
            pushMessage('danger', '更改訂單失敗', msg)
          })
        }
      }).catch(function (error) {
        pushMessage('danger', '更改訂單失敗', error?.message)
      }).finally(function () {
        getOrders(1, 'admin')
      })
    }
    function getOrder (id) {
      order.value = {}
      isLoading.value = true
      http.get(`/api/${import.meta.env.VITE_PATH}/order/${id}`)
        .then(function (response) {
          if (response.data.success) {
            order.value = response.data.order
            user.value = response.data.order.user
            isLoading.value = false
          }
        }).catch(function (error) {
          pushMessage('danger', '取得訂單失敗', error?.message)
        })
    }
    function getOrders (page, role) {
      orders.value = []
      isLoading.value = true
      pagination.value = {}
      http.get(
        role === 'admin' ?
          `/api/${import.meta.env.VITE_PATH}/admin/orders` :
          `/api/${import.meta.env.VITE_PATH}/orders`,
        { 
          params: { page }
        }
      ).then(function (response) {
        if (response.data.success) {
          orders.value = response.data.orders
          pagination.value = response.data.pagination
          isLoading.value = false
        }
      })
    }
    function payOrder () {
      http.post(`/api/${import.meta.env.VITE_PATH}/pay/${order.value.id}`
      ).then(function (response) {
        if (response.data.success) {
          pushMessage('success', response.data.message)
        } else {
          pushMessage('danger', '付款失敗')
        }
      })
    }
    function removeOrder () {
      http.delete(`/api/${import.meta.env.VITE_PATH}/admin/order/${order.value.id}`)
        .then(function (response) {
          if (response.data.success) {
            pushMessage('success', '移除訂單成功', response.data.message)
          } else {
            pushMessage('danger', '移除訂單失敗', response.data.message)
          }
        }).catch(function (error) { 
          pushMessage('danger', '移除訂單失敗', error?.message)
        }).finally(function () { 
          getOrders(1, 'admin') 
        })
    }
    function removeOrders () {
      http.delete(`/api/${import.meta.env.VITE_PATH}/admin/orders/all`)
        .then(function (response) {
          if (response.data.success) {
            pushMessage('success', '移除訂單成功', response.data.message)
          } else {
            pushMessage('danger', '移除訂單失敗', response.data.message)
          }
        }).catch(function (error) {
          pushMessage('danger', '移除訂單失敗', error?.message) 
        }).finally(function () { 
          getOrders(1, 'admin')
        })
    }
    return { order, orders, pagination, user, addOrder, editOrder, getOrder, getOrders, payOrder, removeOrder, removeOrders }
  }
)