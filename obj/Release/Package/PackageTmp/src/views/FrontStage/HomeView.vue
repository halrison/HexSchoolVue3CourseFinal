<template>
  <LoadingC v-bind:is-full-apge="true" v-bind:active="isLoading" />
  <div class="row justify-content-center my-auto">
    <div class="text-center">
      <h1 class="mt-3">Zay 生活用品店</h1>
      <p class="text-muted mb-0">你的品味，由你創造</p>
      <button class="btn btn-dark rounded-0 mt-6" v-on:click="getDiscount">立即搶折扣</button>
    </div>
  </div>
  <div class="row my-5">
    <h2 class="text-center">熱銷商品</h2>
    <div class="mt-md-4">
      <Swiper v-bind:products="products"/>
    </div>
  </div>
  <h2 class="text-center">顧客評論</h2>
  <div class="bg-light my-2">
    <Carousel v-bind:items="Comments" v-slot="{ items }">
      <div class="carousel-item my-5" v-for="comment, index in items" v-bind:key="index" v-bind:class="{ 'active': index === 0 }">
        <div class="py-7 text-center">
          <h3>{{ comment.message }}</h3>
          <p>
            <small>—{{ comment.author }}—</small>
          </p>
        </div>
      </div>
    </Carousel>
  </div>
  <h2 class="text-center">最新文章</h2>
  <div class="row my-2 m-auto" v-for="article in filterArticles" :key="article.id">
    <ArticleCard v-bind:article="article" />
  </div>
  <div class="bg-light py-4" id="discount-area">
    <div class="container">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center align-items-start">
        <div class="input-group w-md-50 mt-md-0 mt-3">
          <p class="me-1 fw-bold my-auto">輸入即享二折優惠</p>
          <input type="text" class="form-control rounded-0" value="anniversity" readonly />
          <div class="input-group-append">
            <button class="btn btn-dark rounded-0" type="button" v-on:click="copyDiscountCode">
              複製折扣碼
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import useLoadingStore from "@/stores/loading"
  import useProductStore from "@/stores/products"
  import useArticleStore from "@/stores/articles"
  import useMessageStore from "@/stores/messages"
  import Swiper from "@/components/SwiperComponent.vue"
  import Carousel from "@/components/CarouselComponent.vue"
  import ArticleCard from "@/components/ArticleCard.vue"
  import Comments from "@/stores/Comments.json"
  import { storeToRefs } from 'pinia'
  import { computed, onMounted } from "vue"


  const { isLoading } = storeToRefs(useLoadingStore())

  const ProductStore = useProductStore()
  const { getProducts } = ProductStore
  const { products } = storeToRefs(ProductStore)

  const ArticleStore = useArticleStore()
  const { getArticles } = ArticleStore
  const { articles } = storeToRefs(ArticleStore)

  const filterArticles = computed(() => [...articles.value].sort(() => Math.random() - 0.5).splice(0, 2))

  onMounted(async function () {
    Promise.all([ getProducts(1, 'customer'), getArticles(1, 'customer') ])
    .catch(function (error) {
      useMessageStore().pushMessage('info', '', error)
    })
  })

  function getDiscount(){
    document.getElementById("discount-area").scrollIntoView()
  }
  function copyDiscountCode () {
    navigator.clipboard.writeText('aniversity')
  }
</script>

<style scoped>
  h1 {
    font-weight: 500;
    font-size: 2.6rem;
    position: relative;
    top: -10px;
  }
  h3 {
    font-size: 1.2rem;
  }

  .greetings h1,
  .greetings h3 {
    text-align: center;
  }

  @media (min-width: 1024px) {
    .greetings h1,
    .greetings h3 {
      text-align: left;
    }
  }
</style>