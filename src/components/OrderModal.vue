<template>
  <div class="modal fade container-fluid" tabindex="-1" ref="DOM">
    <div class="modal-dialog modal-lg" role="dialog">
      <div class="modal-content">
        <div class="modal-header">訂單編號：{{ order.id }}</div>
        <slot :order="order"></slot>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { onMounted, ref, watch } from "vue"
  import { Modal } from "bootstrap"
  import { storeToRefs } from "pinia"
  import useOrderStore from "@/stores/orders"

  const DOM = ref(null)
  const form = ref(null)
  const prop = defineProps([ 'order', 'type' ])
  const orderStore = useOrderStore()
  const { getOrder, getOrders } = orderStore
  const { order, user } = storeToRefs(orderStore)
  let modal

  onMounted(function () {
    modal = new Modal(DOM.value)
  })
  defineExpose({ show, hide })
  watch(
    () => prop.order,
    async function (newValue) {
      await getOrder(newValue.id)
      user.value = order.value.user || newValue.user
    },
    { deep: true }
  )

  function show () {
    modal.show() 
  }
  function hide () { 
    modal.hide()
    getOrders(1,prop.type)
  }
</script>
