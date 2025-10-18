<template>
  <div aria-live="polite" aria-atomic="true" class="position-relative">
    <div class="toast-container position-absolute top-0 end-0 p-3">
      <ToastMessage v-for="message, index in messages" :key="index" :msg="message" />
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia"
import useMessageStore from '@/stores/messages'
import ToastMessage from '@/components/ToastMessage.vue'

const { messages } = storeToRefs(useMessageStore())
</script>