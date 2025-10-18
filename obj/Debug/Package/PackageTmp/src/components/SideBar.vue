<template>
  <nav class="navbar navbar-light bg-light sticky-top">
    <router-link to="/" class="text-primary navbar-brand ms-2">
      <img src="@/assets/images/apple-icon.png" width="30" height="24" />
      <h6 class="d-inline-block ms-1">後臺管理系統</h6>
    </router-link>
    <button @click="toggleShow" v-bind:class="isDesktop ? 'invisible' : 'visible'" ref="myCollapse" class="navbar-toggler" type="button"
      aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div id="navbarNavAltMarkup" class=" navbar-collapse vh-100" v-bind:class="isActive || isDesktop ? '' : 'collapse'">
      <div class="nav flex-column">
        <router-link to="/admin/product" class="text-center text-secondary nav-link" @click="toggleShow">
          <i class="fa-brands fa-product-hunt"></i>
          商品
        </router-link>
        <router-link to="/admin/coupon" class="text-center text-secondary nav-link" @click="toggleShow">
          <i class="bi bi-box-arrow-in-right"></i>
          優惠券
        </router-link>
        <router-link to="/admin/order" class="text-center text-secondary nav-link" @click="toggleShow">
          <i class="fa-solid fa-note-sticky"></i>
          訂單
        </router-link>
        <router-link to="/admin/article" class="text-center text-secondary nav-link" @click="toggleShow">
          <i class="bi bi-cart"></i>
          文章
        </router-link>
        <div class="d-grid gap-2">
          <button class="btn btn-danger" type="button" @click="logout">登出</button>
        </div>
      </div>
    </div>
  </nav>
</template>
<script setup>
  import { Collapse } from 'bootstrap'
  import { ref, onMounted, watchEffect } from 'vue'
  import { http } from '../util'
  import { useRouter } from 'vue-router'

  const myCollapse = ref(null)
  const isActive = ref(false)
  const isDesktop = ref(false)
  const screenWidth = ref(window.innerWidth)
  const router = useRouter()
  let bsCollapse

  onMounted(function () {
    bsCollapse = new Collapse(
      myCollapse.value,
      {
        toggle: isActive.value
      }
    )
    window.addEventListener('resize', function () { 
      screenWidth.value = window.innerWidth
    })
  })
  watchEffect(function () {
    if (screenWidth.value > 768) {
      isActive.value = true
      isDesktop.value = true
    } else {
      isActive.value = false
      isDesktop.value = false
    }
  })

  function toggleShow () {
    isActive.value = !isActive.value
  }
  function logout () {
    http.post('/logout')
      .then(function (response) {
        if (response.data.success) router.push({ path: '/login' })
      })
  }
</script>