<template>
  <nav class="navbar navbar-light bg-light sticky-top">
    <a href="/admin" class="text-primary navbar-brand ms-2">
      <img src="@/assets/images/apple-icon.png" width="30" height="24" />
      <h6 class="d-inline-block ms-1">後臺管理系統</h6>
    </a>
    <button @click="toggleShow" v-bind:class="isDesktop ? 'invisible' : 'visible'" ref="myCollapse" class="navbar-toggler" type="button"
            aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div id="navbarNavAltMarkup" class=" navbar-collapse vh-100" v-bind:class="isActive || isDesktop ? '' : 'collapse'">
      <div class="nav flex-column">
        <router-link to="/admin/products" class="text-center text-secondary nav-link" @click="toggleShow">
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
<script>
  import { Collapse } from 'bootstrap'
  export default {
    name: 'SideBar',
    inject: [ 'emitter' ],
    methods: {
      toggleShow () {
        if ( !this.isDesktop ) {
          this.isActive = !this.isActive
          if ( this.isActive ) {
            this.collapse.show()
          } else {
            this.collapse.hide()
          }
        }
      },
      logout () {
        this.$http.post( `${ process.env.VUE_APP_API }/logout`, {
          method: 'POST',
          //  headers: {
          //    'Content-Type': 'application/json'
          //  },
          //  credentials: 'include'
        } )
          .then( () => {
            this.$router.push( '/login' )
          } )
          .catch( err => {
            this.emitter.emit( 'message', { type: 'danger', title: '登入失敗', content: err.message } )
          } )
      }
    },
    watch: {
      screenWidth ( newWidth ) {
        if ( newWidth >= 992 ) {
          this.isActive = true
          this.isDesktop = true
        } else {
          this.isDesktop = false
          this.isActive = false
        }
      }
    },
    mounted () {
      this.isDesktop = this.screenWidth >= 992
      this.collapse = new Collapse(
        this.$refs.myCollapse,
        {
          toggle: this.isActive
        }
      )
      window.addEventListener( 'resize', () => {
        this.screenWidth = window.innerWidth
        this.isDesktop = this.screenWidth >= 992
      } )
    },
    data () {
      return {
        isActive: false,
        isDesktop: false,
        screenWidth: window.innerWidth,
        collapse: null
      }
    }
  }
</script>
<style scoped>
  .active {
    background-color: aqua;
  }
</style>