<template>
  <div class="row">
    <div class="col-sm-3">
      <SideBar />
    </div>
    <main class="col-9 ms-sm-auto px-md-4">
      <ToastList />
      <router-view />
    </main>
  </div>
</template>
<script>
  import ToastList from '@/components/ToastList.vue'
  import SideBar from '@/components/SideBar.vue'
  export default {
    name: 'RearStage',
    components: { SideBar, ToastList }
  }
</script>