<template>
  <LoadingC :active="isLoading" :is-full-page="true" />
  <div class="container mt-1">
    <div class="row justify-content-center">
      <figure class="col figure">
        <Carousel :items="product.imagesUrl ? [ product.imageUrl, ...product.imagesUrl ] : [ product.imageUrl ]" v-slot="{ items }">
          <div class="ratio ratio-1x1 carousel-item" v-for="image, index in items" :key="index" :class="{ 'active': index === 0 }">
            <img :src="image" class="d-block img-fluid" />
          </div>
        </Carousel>
      </figure>
      <div class="col">
        <nav class="row mt-1" aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">所有商品</li>
            <li class="breadcrumb-item active" aria-current="page">{{ product.category }}</li>
          </ol>
        </nav>
        <h2 class="fw-bold h1 mb-1">{{ product.title }}</h2>
        <div class="row">
          <div class="col-6">
            <template v-if="product.price">
              <p class="mb-0 text-muted text-end">
                原價<del>{{ product.origin_price }}</del> 元
              </p>
              <h4 class="fw-bold text-end">現在只要 {{ product.price }} 元</h4>
            </template>
            <h4 v-else>{{ product.price }} 元</h4>
          </div>
          <div class="col-6">
            <button class="btn btn-secondary input-group-prepend w-100 py-2" v-if="isFavorite" @click="favorite">
              <i class="fa-solid fa-heart border-0"></i>移除最愛
            </button>
            <button class="btn btn-outline-secondary input-group-prepend w-100 py-2" v-else @click="favorite">
              <i class="fa-regular fa-heart border-0"></i>加入最愛
            </button>
          </div>
        </div>
        <div class="row align-items-center">
          <div class="col-6">
            <div class="input-group my-3 bg-light rounded">
              <div class="input-group-prepend">
                <button class="btn btn-outline-dark border-0 py-2" type="button" @click="quantity--">
                  <i class="bi bi-dash"></i>
                </button>
              </div>
              <input type="text" class="form-control border-0 text-center my-auto shadow-none bg-light"
                aria-label="Example text with button addon" aria-describedby="button-addon1" :value="quantity"/>
              <div class="input-group-append">
                <button class="btn btn-outline-dark border-0 py-2" type="button" @click="quantity++">
                  <i class="bi-plus bi"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="col-6">
            <button type="button" class="text-nowrap btn btn-dark w-100 py-2" @click="addToCart(product.id)">
              <i class="bi bi-cart-plus"></i>加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row my-5">
      <div class="col border-end">
        <h3 class="text-center">商品描述</h3>
        <p>{{ product.description }}</p>
      </div>
      <div class="col">
        <h3 class="text-center">商品說明</h3>
        <p>{{ product.content }}</p>
      </div>
    </div>
    <h3 class="text-center">更多商品</h3>
    <Swiper class="mb-1" :products="products.filter(product => product.id !== route.query.id)" />
  </div>
</template>

<script setup>
  import useProductStore from "@/stores/products"
  import useLoadingStore from "@/stores/loading"
  import useMessageStore from "@/stores/messages"
  import useCartStore from "@/stores/carts"
  import Carousel from "@/components/CarouselComponent.vue"
  import Swiper from "@/components/SwiperComponent.vue"
  import { onMounted, ref } from "vue"
  import { storeToRefs } from "pinia"
  import { useRoute } from "vue-router"


  const ProductStore = useProductStore()
  const { getProduct, getProducts } = ProductStore
  const { product, products } = storeToRefs(ProductStore)

  const { isLoading } = storeToRefs(useLoadingStore())

  const { pushMessage } = useMessageStore()

  const cartStore = useCartStore()
  const { addCart, getCarts } = cartStore
  const { cartList } = storeToRefs(cartStore)

  const route = useRoute()
  const isFavorite = ref(false)
  const quantity = ref(1)
  const emit = defineEmits(['cart'])

  onMounted(async function () {
    Promise.all([ getProduct(route.query.id), getProducts(1, 'customer'), getCarts() ])
    .then(function () {
      isFavorite.value = localStorage.hasOwn('favorite') && localStorage.getItem('favorite').includes(route.query.id)
    }).catch(function (error) {
      pushMessage('info', '', error)
    })
  })

  function favorite () {
    isFavorite.value = !isFavorite.value
    let favoriteList = localStorage.hasOwnProperty('favorite') ? JSON.parse(localStorage.getItem('favorite')) : []
    if (favoriteList.includes(product.value.id)) {
      favoriteList = favoriteList.filter(f => f !== product.value.id)
      pushMessage('success', '移除最愛成功', `已將${product.value.title}移除最愛`)
    } else {
      favoriteList = favoriteList.concat(product.value.id)
      pushMessage('success', '加入最愛成功', `已將${product.value.title}加入最愛`)
    }
    localStorage.setItem('favorite', JSON.stringify(favoriteList))
  }
  async function addToCart () {
    if (cartList.value?.find(cart => cart.product_id === product.value.id)) {
      pushMessage('info', '重複加入商品', `商品${product.value.title}已位於購物車中`)
    } else {
      await addCart(quantity.value)
    }
  }
</script>

<style scoped>
  .col p {
    white-space: pre-line;
  }

  .row.mb-1 {
    overflow: clip;
  }
</style>