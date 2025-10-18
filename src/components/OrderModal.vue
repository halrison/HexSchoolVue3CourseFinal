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
<script>
  import modal from "@/mixins/modal"
  export default {
    name: 'OrderModal',
    mixins: [ modal ],
    props: {
      order: {
        type: Object,
        required: true
      }
    }
  }
</script>