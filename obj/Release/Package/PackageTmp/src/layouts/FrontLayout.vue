<template>
  <main class="container">
    <Header />
    <ToastList v-show="messages" />
    <RouterView />
    <Footer />
  </main>
</template>

<script setup>
  import { storeToRefs } from 'pinia'
  import Header from '@/components/HeaderComponent.vue'
  import ToastList from '@/components/ToastList.vue'
  import Footer from '@/components/FooterComponent.vue'
  import useMessageStore from '@/stores/messages'

  const { messages } = storeToRefs(useMessageStore())
</script>