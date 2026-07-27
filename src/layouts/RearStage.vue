<template>
    <div class="container vh-100">        
        <div class="row">
            <aside class="col-lg-2">
                <SideBar />
            </aside>
            <main class="col-lg-10 ms-sm-auto px-md-4"> 
                <ToastList/>
                <router-view />
            </main>
        </div>
    </div>
</template>
<script setup>
  import ToastList from '@/components/ToastList.vue'
  import SideBar from '@/components/SideBar.vue'
</script>