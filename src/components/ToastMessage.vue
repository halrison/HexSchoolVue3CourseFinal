<template>
  <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" ref="DOM">
    <div class="toast-header">
      <span class="p-2 me-2 d-inline-block badge rounded-pill" v-bind:class="`bg-${$props.msg.type}`"></span>
      <strong class="me-auto">{{ $props.msg.title }}</strong>
      <small class="text-muted">{{ new Date().toLocaleDateString() }}</small>
    </div>
    <div class="toast-body">{{ $props.msg.content }}</div>
  </div>
</template>
<script>
  import { Toast } from "bootstrap"
  let toast
  export default {
    name: 'ToastMessage',
    props: [ 'msg' ],
    mounted () {
      toast = new Toast(
        this.$refs.DOM,
        {
          delay: 4000,
          animation: true
        }
      )
      this.show()
    },
    methods: {
      show () {
        toast.show()
      }
    }
  }
</script>
<!--<script setup>
import { onMounted, ref } from "vue"

const DOM = ref(null)
const prop = defineProps(['msg'])
let toastObject

onMounted(function(){
  toastObject.show()
})
</script>-->
