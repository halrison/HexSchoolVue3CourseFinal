<template>
  <LoadingC :is-full-page="true" :active="isLoading" />
  <div class="container">
    <div class="row">
      <nav class="col-3 bg-light float-start">
        <div class="position-sticky pt-3 h-100">
          <p>分類篩選</p>
          <select class="form-select" v-model="selected">
            <option selected value="">全部</option>
            <option value="favorite">最愛</option>
            <option v-for="category in categories"
                    :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
      </nav>
      <div class="col-9 mt-1">
        <div class="card-group row">
          <div class="col-12 col-md-6 col-lg-4" v-for="product in filterProducts" :key="product.id">
            <ProductCard :product="product" class="mb-3">
              <template #header>
                <div class="card-header">
                  <router-link :to="`/product?id=${product.id}`" class="text-decoration-none">
                    <h6 class="text-center">{{ product.title }}</h6>
                  </router-link>
                </div>
              </template>
              <template #body>
                <div class="card-body">
                  <div class="card-text" v-if="product.origin_price===product.price">
                    <div class="text-center">台幣{{ product.price }}元</div>
                  </div>
                  <div class="card-text" v-else>
                    <span class="float-start">原價{{product.origin_price}}元</span>
                    <span class="float-end">特價{{product.price}}元</span>
                  </div>
                </div>
              </template>
              <template #footer>
                <div class="card-footer">
                  <div class="text-center">剩餘{{ product.num }}{{ product.unit }}</div>
                </div>
              </template>
            </ProductCard>
          </div>
        </div>
      </div>
    </div>
    <Pagination :pagination="pagination" v-show="pagination.total_pages > 1" @paginate="getProducts" />
  </div>
</template>
<script>
  import Pagination from '@/components/PaginationBar.vue';
  import ProductCard from '@/components/ProductCard.vue';
  export default {
    name: 'ProductList',
    components: { ProductCard, Pagination },
    inject: [ 'emitter' ],
    computed: {
      filterProducts () {
        if ( this.selected === '' ) {
          return this.products;
        } else if ( this.selected === 'favorite' ) {
          return this.products.filter( product => product.is_favorite );
        } else {
          return this.products.filter( product => product.category === this.selected );
        }
      },
    },
    methods: {
      getProducts ( page = 1 ) {
        this.isLoading = true;
        this.$http.get(
          `${ process.env.VUE_APP_API }/api/${ process.env.VUE_APP_PATH }/products`,
          { params: { page } }
        ).then( res => {
          if ( res.data.success ) {
            this.products = res.data.products;
            this.pagination = res.data.pagination;
            this.categories = [ ...new Set( this.products.map( product => product.category ) ) ];
          } else {
            this.emitter.emit( 'message', { type: 'warning', title: '取得商表列表失敗', content: res.data.message } );
          }
        } ).catch( err => {
          this.emitter.emit( 'message', { type: 'danger', title: '取得商表列表失敗', content: err.response.data.message } );
        } ).finally( () => {
          this.isLoading = false;
        } );
      },
    },
    created () {
      this.getProducts();
    },
    data () {
      return {
        products: [],
        categories: [],
        selected: '',
        pagination: {},
        isLoading: false,
      };
    }
  }
</script>