<template>
    <div aria-live="polite" aria-atomic="true" class="position-relative">
        <div class="toast-container position-fixed top-0 end-0 p-3">
            <ToastMessage v-for="(message, index) in messageStore.messages" :key="index" :msg="message" />
        </div>
    </div>
</template>
<script setup>
    import {inject} from 'vue'
    import ToastMessage from '@/components/ToastMessage.vue'
    const messageStore = inject('message')
</script>