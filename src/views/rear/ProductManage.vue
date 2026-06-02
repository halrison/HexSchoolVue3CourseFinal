<template>
    <div class="container">
        <div class="d-flex justify-content-end me-1">
            <button type="button" class="btn btn-outline-info mt-2" @click="openModal('add')">
                <i class="bi bi-plus me-1"></i>
                新增商品
            </button>
        </div>
        <LoadingC :is-full-page="true" :active="isLoading" />
        <div class="table-responsive-sm overflow-x-hidden mt-3">
            <table class="table table-striped">
                <thead>
                    <tr class="row mx-0">
                        <th class="col-4 col-lg-2">分類</th>
                        <th class="col-8 col-lg-4">產品名稱</th>
                        <th class="col-4 col-sm-3 col-lg-1 text-lg-end">原價</th>
                        <th class="col-4 col-sm-3 col-lg-1 text-lg-end">售價</th>
                        <th class="col-4 col-sm-2 col-lg-1 text-lg-center">狀態</th>
                        <th class="col-sm-4 col-lg-3 text-center">動作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="row mx-0" v-for="product in products" :key="product.id">
                        <td class="col-4 col-lg-2">{{ product.category }}</td>
                        <td class="col-8 col-lg-4">{{ product.title }}</td>
                        <td class="col-4 col-sm-3 col-lg-1 text-lg-end">{{ $filters.currency(product.origin_price) }}</td>
                        <td class="col-4 col-sm-3 col-lg-1 text-lg-end">{{ $filters.currency(product.price) }}</td>
                        <td class="col-4 col-sm-2 col-lg-1 text-lg-center">
                            <div v-bind:class="product.is_enabled === 1 ? 'text-success' : 'text-danger'">
                                {{ product.is_enabled === 1 ? '啟' : '停' }}用
                            </div>
                        </td>
                        <td class="col-sm-4 col-lg-3">
                            <div class="btn-group btn-group-sm w-100">
                                <button @click="openModal('modify',product)" class="btn btn-outline-warning">
                                    <i class="bi bi-pencil-square me-1"></i>
                                    編輯
                                </button>
                                <button @click="openModal('remove',product)" class="btn btn-outline-danger">
                                    <i class="bi bi-trash me-1"></i>
                                    移除
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <Pagination :pagination="pagination" v-show="pagination.total_pages > 1" @paginate="getProducts" />
        <ProductModal :product="product" ref="addEditModal" @add-edit="addEditProduct" />
        <RemoveModal :item="product" type="商品" ref="removeModal" @remove="getProducts" />
    </div>
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