<template>
  <LoadingC :is-full-page="true" :active="isLoading" />
  <button type="button" class="btn btn-primary float-end mt-1" @click="openModal('add')">新增商品</button>
  <div class="table-responsive-sm overflow-x-hidden mt-5">
    <table class="table table-striped">
      <thead class="sticky-top">
        <tr class="row mx-0">
          <th class="col-sm-3 col-lg-2">分類</th>
          <th class="col-sm-9 col-lg-3">產品名稱</th>
          <th class="col-sm-3 col-lg-2 text-lg-end">原價</th>
          <th class="col-sm-3 col-lg-2 text-lg-end">售價</th>
          <th class="col-sm-3 col-lg-1 text-lg-center">狀態</th>
          <th class="col-sm-3 col-lg-2">動作</th>
        </tr>
      </thead>
      <tbody>
        <tr class="row mx-0" v-for="product in products" :key="product.id">
          <td class="col-sm-3 col-lg-2">{{ product.category }}</td>
          <td class="col-sm-9 col-lg-3">{{ product.title }}</td>
          <td class="col-sm-3 col-lg-2 text-lg-end">{{ $filters.currency(product.origin_price) }}</td>
          <td class="col-sm-3 col-lg-2 text-lg-end">{{ $filters.currency(product.price) }}</td>
          <td class="col-sm-3 col-lg-1 text-lg-center"
              v-bind:class="product.is_enabled === 1 ? 'text-success' : 'text-danger'">
            {{ product.is_enabled === 1 ? '啟' : '停' }}用
          </td>
          <td class="col-sm-3 col-lg-2">
            <div class="btn-group btn-group-sm">
              <button @click="openModal('modify',product)" class="btn btn-outline-primary">
                <i class="bi bi-pencil-square"></i>
                <span class="d-none d-xl-inline-block">編輯</span>
              </button>
              <button @click="openModal('remove',product)" class="btn btn-outline-danger">
                <i class="bi bi-trash"></i>
                <span class="d-none d-xl-inline-block">移除</span>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <Pagination :pagination="pagination" v-show="pagination.total_pages > 1" @paginate="getProducts" />
  <ProductModal :product="product" ref="addEditModal" @add-edit="addEditProduct" />
  <RemoveModal :item="product" type="商品" ref="removeModal" @remove="getProducts"/>
</template>
<script>
  import Pagination from '@/components/PaginationBar.vue'
  import ProductModal from '@/components/ProductModal.vue'
  import RemoveModal from '@/components/RemoveModal.vue'
  export default {
    name: 'ProductManage',
    components: { Pagination, ProductModal, RemoveModal  },
    inject: [ 'emitter' ],
    methods: {
      addEditProduct ( tempProduct ) {
        this.product = tempProduct
        const type = this.product.id ? 'put' : 'post'
        const api = this.product.id ? `${ process.env.VUE_APP_API }/api/${ process.env.VUE_APP_PATH }/admin/product/${ this.product.id }` : `${ process.env.VUE_APP_API }/api/${ process.env.VUE_APP_PATH }/admin/product`
        this.$http[ type ](
          api,
          { data: this.product } )
          .then( res => {
            if ( res.data.success ) {
              this.$refs.addEditModal.hideModal()
              this.emitter.emit( 'message', { type: 'success', title: `${type==='put' ? '變更' :'新增'}產品成功`, content: res.data.message } )
            } else {
              this.emitter.emit( 'message', { type: 'warning', title: `${type==='put' ? '變更' :'新增'}產品失敗`, content: res.data.message } )
            }
          } )
          .catch( err => {
            err.response.data.message.forEach( msg => {
              this.emitter.emit( 'message', { type: 'danger', title: `${type==='put' ? '變更' :'新增'}產品發生錯誤`, content: msg } )
            } )
          } )
          .finally( () => { this.getProducts() } )
      },
      getProducts ( page = 1 ) {
        this.isLoading = true
        this.$http.get(
          `${ process.env.VUE_APP_API }/api/${ process.env.VUE_APP_PATH }/admin/products`,
          { params: { page } 
          } ).then( res => {
            if ( res.data.success ) {
              this.products = res.data.products
              this.pagination = res.data.pagination
            } else {
              this.emitter.emit( 'message', { type: 'danger', title: '取得產品列表失敗', content: res.data.message } )
            }
          } ).catch( err => {
            this.emitter.emit( 'message', { type: 'danger', title: '取得產品列表失敗', content: err.response.data.message } )
          } ).finally( () => { this.isLoading = false } )
      },
      openModal ( action, item ) {
        switch ( action ) {
          case 'add':
            this.product = {}
            this.$refs.addEditModal.showModal()
            break
          case 'modify':
            this.product = item 
            this.$refs.addEditModal.showModal()
            break
          case 'remove':
            this.product = item 
            this.$refs.removeModal.showModal()
            break
        }
      }
    },
    created () { this.getProducts() },
    data () {
      return {
        products: [],
        product: {},
        pagination: {},
        isLoading: false
      }
    },
  }
</script>