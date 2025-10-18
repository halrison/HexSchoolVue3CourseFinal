import { ref } from "vue"
import { http } from "../util"
import { defineStore, storeToRefs } from "pinia"
import useLoadingStore from "@/stores/loading"
import useMessageStore from "@/stores/messages"
export default defineStore(
  'coupon',
  () => {
    const coupon=ref({})
    const coupons = ref([])
    const pagination = ref({})
    const { pushMessage } = useMessageStore()
    const { isLoading } = storeToRefs(useLoadingStore())

    function addCoupon (coupon) {
      http.post(
        `/api/${import.meta.env.VITE_PATH}/admin/coupon`,
        { data: coupon.value }
      ).then(function (response) {
        if (response.data.success) {
          pushMessage('success', '新增優惠券成功', response.data.message)
        } else {
          response.data.message.forEach(function (msg) { 
            pushMessage('danger', '新增優惠券失敗', msg)
          })
        }
      }).catch(function (error) {
        pushMessage('danger', '新增優惠券失敗', error?.message)
      }).finally(function () { 
        getCoupons(1, 'admin')
      })
    }
    function editCoupon (coupon) {
      http.put(
        `/api/${import.meta.env.VITE_PATH}/admin/coupon/${coupon.value.id}`,
        { data: coupon.value }
      ).then(function (response) {
        if (response.data.success) {
          pushMessage('success', '修改優惠券成功', response.data.message)
        } else {
          response.data.message.forEach(function (msg) { 
            pushMessage('danger', '修改優惠券失敗', msg) 
          })
        }
      }).catch(function (error) {
        pushMessage('danger', '修改優惠券失敗', error?.message)
      }).finally(function () {
        getCoupons(1, 'admin') 
      })
    }
    function getCoupons (page) {
      isLoading.value = true
      pagination.value = {}
      coupons.value = []
      http.get(
        `/api/${import.meta.env.VITE_PATH}/admin/coupons`,
        { 
          param: { page }
        }
      ).then(function (response) {
        if (response.data.success) {
          coupons.value = response.data.coupons
          pagination.value = response.data.pagination
        }
      }).catch(function (error) {
        pushMessage('danger', '取得優惠券失敗', error?.message)
      }).finally(function () { 
        isLoading.value = false 
      })
    }
    function removeCoupon (coupon) {
      http.delete(`/api/${import.meta.env.VITE_PATH}/admin/coupon/${coupon.value.id}`)
        .then(function (response) {
          if (response.data.success) {
            pushMessage('success', '移除優惠券成功', response.data.message)
          } else {
            response.data.message.forEach(function (msg) { 
              pushMessage('danger', '移除優惠券失敗', msg)
            })
          }
        }).catch(function (error) {
          pushMessage('danger', '移除優惠券失敗', error?.message)
        }).finally(function () { 
          getCoupons(1, 'admin')
        })
    }
    return { coupon, coupons, pagination, addCoupon, editCoupon, getCoupons, removeCoupon }
  }
)