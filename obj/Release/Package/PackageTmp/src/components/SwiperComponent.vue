<template>
  <Swiper ref="{ swiperRef }" 
      :slidesPerView="3"
      :spaceBetween="10"
      :autoplay="{
        delay: 2500,
        disableOnInteraction: false
      }"
      :navigation="true"
      :modules="modules">
    <SwiperSlide class="col-4" v-for="product,index in prop.products" :key="index">
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
      </ProductCard>
    </SwiperSlide>
  </Swiper>
</template>

<script setup>
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { Autoplay, Navigation } from 'swiper/modules'
  import { defineProps } from 'vue'
  import ProductCard from "@/components/ProductCard.vue"
  import 'swiper/css'
  import 'swiper/css/navigation'
  import 'swiper/css/autoplay'

  const modules = [ Autoplay, Navigation ]
  const prop=defineProps(['products'])
</script>