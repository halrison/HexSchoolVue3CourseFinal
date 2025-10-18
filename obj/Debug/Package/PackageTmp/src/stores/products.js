import { ref } from "vue"
import { defineStore, storeToRefs } from "pinia"
import { http } from "../util"
import useMessageStore from "@/stores/messages"
import useLoadingStore from "@/stores/loading"

export default defineStore(
  'products',
  () => {
    const product = ref({})
    const products = ref([])
    const pagination=ref({})
    const { isLoading } = storeToRefs(useLoadingStore())
    const { pushMessage } = useMessageStore()
    
    function addProduct () {
      http.post(
        `/api/${import.meta.env.VITE_PATH}/admin/product/`,
        { 
          data: product.value 
        }
      ).then(function (response) {
          if (response.data.success) {
            pushMessage('success', '新增商品成功', response.data.message)
          } else {
            response.data.message.forEach(function (msg) {
              pushMessage('danger', '新增商品失敗', msg) 
            })
          }
        }).catch(function (error) {
          pushMessage('danger', '新增商品失敗', error?.message)
        }).finally(function () {
          getProducts() 
        })
    }
    function editProduct () {
      http.put(
        `/api/${import.meta.env.VITE_PATH}/admin/product/${product.value.id}`,
        { 
          data: product.value 
        }
      ).then(function (response) {
          if (response.data.success) {
            pushMessage('success', '變更商品成功', response.data.message)
          } else {
            response.data.message.forEach(function (msg) {
              pushMessage('danger', '變更商品失敗', msg)
            })
          }
        }).catch(function (error) {
          pushMessage('danger', '變更商品失敗', error?.message) 
        }).finally(function () {
          getProducts(1,'admin')
        })
    }
    function getProduct (id) {
      isLoading.value = true
      product.value = {}
      http.get(`/api/${import.meta.env.VITE_PATH}/product/${id}`)
        .then(function (response) {
          if (response.data.success) {
            product.value = response.data.product
          } else {
            pushMessage('danger', '取得商品失敗', response.data.message)
          }
        }).catch(function (error) { 
          pushMessage('danger', '取得商品失敗', error?.message) 
        }).finally(function () {
          isLoading.value = false 
        })
    }
    function getProducts (page, role) {
      isLoading.value = true
      products.value = []
      pagination.value={}
      http.get(
        role === 'admin' ?
          `/api/${import.meta.env.VITE_PATH}/admin/products` :
          `/api/${import.meta.env.VITE_PATH}/products`,
        {
          params: { page }
        }).then(function (response) {
          if (response.data.success) {
            products.value =response.data.products
            pagination.value=response.data.pagination
          }
        }).catch(function (error) { 
          pushMessage('danger', '取得商品失敗', error?.message) 
        }).finally(function () {
          isLoading.value = false
        })
    }
    function removeProduct () {
      isLoading.value = true
      http.delete(`/api/${import.meta.env.VITE_PATH}/admin/product/${product.value.id}`)
        .then(function (response) {
          if (response.data.success) {
            pushMessage('success', '移除商品成功', response.data.message)
          } else {
            pushMessage('danger', '移除商品失敗', response.data.message)
          }
        }).catch(function (error) { 
          pushMessage('danger', '移除商品失敗', error?.message) 
        }).finally(function () {
          getProducts(1, 'admin')
          isLoading.value = false
        })
    }
    return { pagination, product, products, getProduct, getProducts, addProduct, editProduct, removeProduct }
  }
)