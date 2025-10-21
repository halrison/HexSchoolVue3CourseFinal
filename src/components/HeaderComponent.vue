<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light sticky-top">
    <a :href="toHome" class="navbar-brand ms-2">
      <img src="@/assets/images/apple-icon.png" width="30" height="24" />
    </a>
    <button @click="toggleShow" ref="myCollapse" class="navbar-toggler" type="button"
            aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div id="navbarNavAltMarkup" class="navbar-collapse justify-content-end" v-bind:class="isActive || isDesktop ? '' : 'collapse'">
      <div class="navbar-nav">
        <router-link to="/articles" class="text-secondary nav-link" @click="toggleShow">
          <i class="fa-solid fa-newspaper"></i>
          文章
        </router-link>
        <router-link to="/login" class="text-secondary nav-link" @click="toggleShow">
          <i class="bi bi-box-arrow-in-right"></i>
          登入
        </router-link>
        <router-link to="/products" class="text-secondary nav-link" @click="toggleShow">
          <i class="fa-brands fa-product-hunt"></i>
          商品
        </router-link>
        <router-link to="/order" class="text-secondary nav-link" @click="toggleShow">
          <i class="fa-solid fa-note-sticky"></i>
          訂單
        </router-link>
        <router-link to="/cart" class="text-secondary nav-link" @click="toggleShow">
          <span class="badge rounded-pill bg-info text-dark" v-if="cartList?.length">{{ cartList.length }}</span>
          <i class="bi bi-cart" v-else></i>
          購物車
        </router-link>
      </div>
    </div>
  </nav>
</template>
<script>
  import { Collapse } from "bootstrap";

  export default {
    name: 'HeaderComponent',
    methods: {
      toggleShow () {
        if ( !this.isDesktop ) {
          this.isActive = !this.isActive;
        }
      },
      updateCart () {
        const cart = JSON.parse( localStorage.getItem( 'cart' ) ) || [];
        this.cartList = cart;
      },
      handleResize () {
        this.isDesktop = window.innerWidth >= 992;
        if ( this.isDesktop ) {
          this.isActive = false; // Ensure menu is shown on desktop
        }
      },
    },
    data () {
      return {
        isActive: false,
        isDesktop: window.innerWidth >= 992,
        cartList: [],
        collapse: null,
        toHome: process.env.BASE_URL
      };
    },
    mounted () {
      this.updateCart();
      this.collapse = new Collapse(
        this.$refs.myCollapse,
        { toggle: this.isActive } );
      window.addEventListener( 'resize', this.handleResize );
      window.addEventListener( 'storage', this.updateCart );
    },
    beforeUnmount () {
      window.removeEventListener( 'resize', this.handleResize );
      window.removeEventListener( 'storage', this.updateCart );
    },
  };
</script>
<style scoped>
  .active {
    background-color: aqua;
  }
</style>