<template>
  <div aria-live="polite" aria-atomic="true" class="position-relative">
    <div class="toast-container position-absolute top-0 end-0 p-3">
      <ToastMessage v-for="message, index in messages" :key="index" :msg="message" />
    </div>
  </div>
</template>
<script>
  import ToastMessage from '@/components/ToastMessage.vue'
  export default {
    name: 'ToastList',
    components: { ToastMessage },
    inject: [ 'emitter' ],
    methods: {
      pushMessage ( message ) {
        this.messages?.push( message)
        setTimeout(
          () => {
            this.messages?.pop()
          },
          4000
        )
      }
},
    data () {
      return {
        messages: []
      }
    },
    mounted () {
      this.emitter.on( 'message', this.pushMessage );
    }
  }
</script>