<template>
  <div class="modal fade" ref="DOM">
    <div class="modal-dialog" role="dialog">
      <FormC class="modal-content" v-slot="{ errors }" @submit="addEditCoupon" @reset="hide" :initial-values="coupon" :initial-errors="error">
        <div class="modal-header">{{ coupon.id ? '編輯' : '新增' }}優惠券</div>
        <div class="modal-body">
          <table class="w-100">
            <tr>
              <td>標題</td>
              <td>
                <FieldC label="標題" name="title" class="form-control" type="text" rules="required" 
                v-model="coupon.title" :class="{ 'is-invalid': errors['title'] }"/>
                <ErrorMessage name="title" class="invalid-feedback"/>
              </td>
            </tr>
            <tr>
              <td>代碼</td>
              <td>
                <FieldC label="代碼" name="code" class="form-control" type="text" rules="required"
                v-model="coupon.code" :class="{ 'is-invalid': errors['code'] }" />
                <ErrorMessage name="code" class="invalid-feedback" />
              </td>
            </tr>
            <tr>
              <td>折扣</td>
              <td>
                <FieldC label="折扣" name="discount" class="form-control" type="number" rules="required|integer" min="1" max="99" 
                v-model="coupon.percent" :class="{ 'is-invalid': errors['discount'] }" />
                <ErrorMessage name="discount" class="invalid-feedback" />
              </td>
            </tr>
            <tr>
              <td>到期日</td>
              <td>
                <FieldC label="到期日" name="date" class="form-control" type="date" rules="required"
                v-model="coupon.due_date" :class="{ 'is-invalid': errors['date'] }" />
                <ErrorMessage name="date" class="invalid-feedback" />
              </td>
            </tr>
            <tr>
              <td>啟用</td>
              <td>
                <input name="enabled" class="form-check-input" type="checkbox" 
                v-model="coupon.is_enabled" :true-value="1" :false-value="0"/>
              </td>
            </tr>
          </table>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-primary">確定</button>
          <button type="reset" class="btn btn-danger">取消</button>
        </div>
      </FormC>
    </div>
  </div>
</template>
<script setup>
  import { defineExpose, defineProps, onMounted, ref, watch } from "vue"
  import { Modal } from "bootstrap"
  import { storeToRefs } from "pinia"
  import useCouponStore from "@/stores/coupons"

  const DOM = ref(null)
  const CouponStore = useCouponStore()
  const { coupon }=storeToRefs(CouponStore)
  const prop=defineProps(['coupon'])
  const error = {
    "title": "",
    "percent": "",
    "date": "",
    "code": ""
  }
  let modal

  defineExpose({ show })
  onMounted(function () {
    modal = new Modal(DOM.value)
  })
  watch(
    ()=>prop.coupon,
    function(newValue){
      coupon.value = newValue
    }
  )

  function show () { 
    modal.show() 
  }
  function hide () { 
    modal.hide()
    CouponStore.getCoupons(1)
  }
  function addEditCoupon () {
    coupon.value.due_date = Date.parse(coupon.value.due_date)
    if (coupon.value.id) { CouponStore.editCoupon(coupon) } else { CouponStore.addCoupon(coupon) }
    hide()
  }
</script>
