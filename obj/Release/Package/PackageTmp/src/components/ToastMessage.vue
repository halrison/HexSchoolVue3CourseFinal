<template>
  <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" ref="DOM">
    <div class="toast-header">
      <span :class="`bg-${prop.msg.type}`" class="p-2 me-2 d-inline-block badge rounded-pill "></span>
      <strong class="me-auto">{{ prop.msg.title }}</strong>
      <small class="text-muted">{{ new Date().toLocaleDateString() }}</small>
    </div>
    <div class="toast-body">{{ prop.msg.content }}</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { Toast } from "bootstrap"

const DOM = ref(null)
const prop=defineProps(['msg'])
let toastObject

onMounted(function(){
  toastObject = new Toast(
    DOM.value,
    { 
      delay: 3000 
    }
  )
  toastObject.show()
})
</script>
