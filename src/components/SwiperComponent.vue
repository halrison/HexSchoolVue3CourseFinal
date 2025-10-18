<template>
  <Swiper v-bind="swiperOptions">
    <SwiperSlide class="col-4 col-xs-12" v-for="product in $props.products" :key="product.id">
      <ProductCard :product="product">
        <template #header>
          <div class="card-header">
            <h5 class="card-title">{{ product.title }}</h5>
          </div>
        </template>
        <template #body>
          <div class="card-body">
            <span class="card-text float-start">台幣{{ product.price }}元</span>
            <span class="card-text float-end">
              <small class="text-muted">剩餘{{ product.num }}{{ product.unit }}</small>
            </span>
          </div>
        </template>
        <template #footer>
          <router-link class="text-decoration-none" :to="`/product?id=${product.id}`">
            <div class="text-center">點此搶購</div>
          </router-link>
        </template>
      </ProductCard>
    </SwiperSlide>
  </Swiper>
</template>
<script>
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { Autoplay, Navigation } from 'swiper/modules'
  import 'swiper/css'
  import 'swiper/css/navigation'
  import 'swiper/css/autoplay'
  import ProductCard from '@/components/ProductCard.vue'
  export default {
    name: 'SwiperComponent',
    components: {
      Swiper,
      SwiperSlide,
      ProductCard
    },
    props: [ 'products' ],
    computed: {
      swiperOptions () {
        return {
          autoplay: {
            delay: 2500,
            disableOnInteraction: false
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          loop: true,
          spaceBetween: 1,
          slidesPerView: 1,
          breakpoints: {
            576: { slidesPerView: 2, spaceBetween: 5 },
            1024: { slidesPerView: 3, spaceBetween: 10 }
          },
          modules: [ Autoplay, Navigation ]
        }
      }
    }
  }
</script>
<style scoped>
  .swiper {
    width: 100%;
    padding-top: 2px;
    padding-bottom: 4px;
  }

  .swiper-slide {
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .swiper-button-next,
  .swiper-button-prev {
    color: #000;
  }
</style>