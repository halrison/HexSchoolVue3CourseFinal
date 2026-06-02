<template>
    <main class="container" @message="pushMessage">
        <ToastList />
        <Header />
        <RouterView />
        <Footer />
    </main>
</template>
<script>
  import Header from "@/components/HeaderComponent.vue";
  import Footer from "@/components/FooterComponent.vue";
  import ToastList from "@/components/ToastList.vue";
  export default {
    name: "FrontStage",
    components: {
      Header,
      Footer,
      ToastList
    }
  }
</script>