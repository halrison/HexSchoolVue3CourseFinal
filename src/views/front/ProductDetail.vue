<template>
  <LoadingC :active="isLoading" :is-full-page="true" />
  <div class="container mt-1">
    <div class="row justify-content-center">
      <figure class="col figure">
        <Carousel :items="product.imagesUrl ? [ product.imageUrl, ...product.imagesUrl ] : [ product.imageUrl ]" v-slot="{ items }">
          <div class="ratio ratio-1x1 carousel-item" v-for="image, index in items" v-bind:class="{ 'active': index === 0 }" :key="index">
            <img class="d-block img-fluid" :src="image" />
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
                     aria-label="Example text with button addon" aria-describedby="button-addon1" :value="quantity" />
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
    <Swiper class="mb-1" :products="filterProducts" />
  </div>
</template>
<script>
  import Carousel from '@/components/CarouselComponent.vue';
  import Swiper from '@/components/SwiperComponent.vue';
  export default {
    name: 'ProductDetail',
    components: {
      Carousel,
      Swiper
    },
    methods: {
      addToCart ( id ) {
        const cart = {
          product_id: id,
          qty: this.quantity
        };
        this.$http.post(
          `${ process.env.VUE_APP_API }/api/${ process.env.VUE_APP_PATH }/cart`,
          {
            data: cart
          } ).then( ( res ) => {
            if ( res.data.success ) {
              this.emitter.emit( 'message', { type: 'success', title: '加入購物車成功', content: res.data.message } );
            } else {
              this.emitter.emit( 'message', { type: 'warning', title: '加入購物車失敗', content: res.data.message } );
            }
          } ).catch( ( err ) => {
            this.emitter.emit( 'message', { type: 'danger', title: '加入購物車失敗', content: err.response.data.message } );
          } );
      },
      favorite () {
        this.isFavorite = !this.isFavorite;
        let favoriteList = localStorage.getItem( 'favorite' ) ? JSON.parse( localStorage.getItem( 'favorite' ) ) : []
        if ( favoriteList.includes( this.product.id ) ) {
          favoriteList = favoriteList.filter( f => f !== this.product.id )
          this.emitter.emit('message',{type: 'success',title: '移除最愛成功',content: `已將${ this.product.title }移除最愛`} )
        } else {
          favoriteList = favoriteList.concat( this.product.id )
          this.emitter.emit('message',{type: 'success',title: '加入最愛成功',content: `已將${ this.product.title }加入最愛`} )
        }
        localStorage.setItem( 'favorite', JSON.stringify( favoriteList ) )
      },
    },
    computed: {
      filterProducts () {
        return this.products.filter( product => product.id !== this.$route.query.id )
      }
    },
    data () {
      return {
        product: {},
        products: [],
        quantity: 1,
        isLoading: false,
        isFavorite: false,
      }
    },
    created () {
      this.isLoading = true;
      this.$http
        .get( `${ process.env.VUE_APP_API }/api/${ process.env.VUE_APP_PATH }/products/all` )
        .then( ( res ) => {
          if ( res.data.success ) {
            this.products = res.data.products;
          } else {
            this.emitter.emit( 'message', { type: 'warning', title: '取得商品失敗', content: res.data.message } );
          }
        } )
        .catch( ( err ) => {
          this.emitter.emit( 'message', { type: 'danger', title: '取得商品失敗', content: err.response.data.message } );
        } ).finally( () => {
          this.isLoading = false;
        } );
    },
    mounted () {
      this.isLoading = true;
      this.$http
        .get( `${ process.env.VUE_APP_API }/api/${ process.env.VUE_APP_PATH }/product/${ this.$route.query.id }` )
        .then( ( res ) => {
          if ( res.data.success ) {
            this.product = res.data.product;
          } else {
            this.emitter.emit( 'message', { type: 'warning', title: '取得商品失敗', content: res.data.message } );
          }
        } )
        .catch( ( err ) => {
          this.emitter.emit( 'message', { type: 'danger', title: '取得商品失敗', content: err.response.data.message } );
        } ).finally( () => {
          this.isLoading = false;
        } );
    }
  }
</script>