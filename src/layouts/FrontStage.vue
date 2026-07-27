<template>
    <main class="container">
        <ToastList />
        <Header />
        <RouterView />
        <Footer />
    </main>
</template>
<script setup>
  import Header from "@/components/HeaderComponent.vue";
  import Footer from "@/components/FooterComponent.vue";
  import ToastList from "@/components/ToastList.vue";
</script>