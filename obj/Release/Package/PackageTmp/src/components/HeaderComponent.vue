<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light sticky-top">
    <a href="/" class="navbar-brand ms-2">
      <img src="@/assets/images/apple-icon.png"  width="30" height="24"/>
    </a>
    <button v-on:click="toggleShow" ref="myCollapse" class="navbar-toggler" type="button"
      data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
      aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div :class="{ 'show': isActive }" class="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
      <div class="navbar-nav">
        <router-link to="/articles" class="text-secondary nav-link">
          <i class="fa-solid fa-newspaper"></i>
          文章
        </router-link>
        <router-link to="/login" class="text-secondary nav-link">
          <i class="bi bi-box-arrow-in-right"></i>
          登入
        </router-link>
        <router-link to="/products" class="text-secondary nav-link">
          <i class="fa-brands fa-product-hunt"></i>
          商品
        </router-link>
        <router-link to="/order" class="text-secondary nav-link">
          <i class="fa-solid fa-note-sticky"></i>
          訂單
        </router-link>
        <router-link to="/cart" class="text-secondary nav-link">
          <span class="badge rounded-pill bg-info text-dark" v-if="cartList?.length">{{ cartList.length }}</span>
          <i class="bi bi-cart" v-else></i>
          購物車
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { Collapse } from 'bootstrap'
import { ref,onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import useCartStore from "@/stores/carts"

const myCollapse = ref(null)
const isActive=ref(false)
const { cartList }=storeToRefs(useCartStore())
let bsCollapse

onMounted(function () {
  bsCollapse = new Collapse(
    myCollapse.value, 
    {
      toggle: false
    }
  )
})

function toggleShow () { isActive.value = !isActive.value }
</script>

<style scoped>
.active{
  background-color:aqua;
}
</style>