<template>
  <div aria-live="polite" aria-atomic="true" class="position-relative">
    <div class="toast-container position-fixed top-0 end-0 p-3">
      <ToastMessage v-for="message, index in messages" :key="index" :msg="message" />
    </div>
  </div>
</template>
<script>
  import ToastMessage from '@/components/ToastMessage.vue'
  import messageStore from '@/stores/messages.js'
  export default {
    name: 'ToastList',
    components: { ToastMessage },
    inject: [ 'emitter' ],
    mixins: [messageStore],
    mounted () {
      this.emitter.on( 'message', this.pushMessage );
    }
  }
</script>