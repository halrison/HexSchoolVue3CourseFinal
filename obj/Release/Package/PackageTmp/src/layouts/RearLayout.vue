<template>
  <div class="row">
    <div class="col-sm-3">
      <SideBar />
    </div>
    <main class="col-9 ms-sm-auto px-md-4">
      <ToastList v-show="messages"/>
      <router-view />
    </main>
  </div>
</template>

<script setup>
  import { storeToRefs } from 'pinia'
  import SideBar from '@/components/SideBar.vue'
  import ToastList from "@/components/ToastList.vue"
  import useMessageStore from '@/stores/messages'

  const { messages } = storeToRefs(useMessageStore())
</script>

<style>
  @media (max-width: 768px) {
    [class^='col'] {
      width: 100vw;
    }
    .col-9 {
      top: 100px;
    }
  }
</style>