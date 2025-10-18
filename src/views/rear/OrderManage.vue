<template>
  <LoadingC :is-full-page="true" :active="isLoading" />
  <button class="btn btn-danger float-end mt-1" @click="openModal('clear')">刪除所有訂單</button>
  <div class="table-responsive-sm overflow-x-hidden mt-5">
    <table class="table table-striped">
      <thead class=" sticky-top">
        <tr class="row mx-0">
          <th class="col-sm-1 col-lg-4">
            <span class="d-block d-md-none d-lg-block">訂單編號</span>
            <span class="d-none d-md-block d-lg-none">#</span>
          </th>
          <th class="col-sm-3 col-lg-2">建立日期</th>
          <th class="col-sm-3 col-lg-2">付款日期</th>
          <th class="col-sm-2 col-lg-2 text-lg-end">付款金額</th>
          <th class="col-sm-3 col-lg-2">動作</th>
        </tr>
      </thead>
      <tbody>
        <tr class="row mx-0" v-for="order in orders" :key="order.id">
          <td class="col-sm-1 col-lg-4">
            <span class="d-block d-md-none d-lg-block">{{ order.id }}</span>
            <span class="d-none d-md-block d-lg-none">{{ order.num }}</span>
          </td>
          <td class="col-sm-3 col-lg-2">{{ order.create_at ? $filters.transDate(order.create_at * 1000) : '-' }}</td>
          <td class="col-sm-3 col-lg-2">{{ order.paid_date ? $filters.transDate(order.paid_date * 1000) : '尚未付款' }}</td>
          <td class="col-sm-2 col-lg-2 text-lg-end">{{ $filters.currency(order.total) }}</td>
          <td class="col-sm-3 col-lg-2">
            <div class="btn-group btn-group-sm" role="group" aria-label="Basic example">
              <button class="btn btn-outline-primary" @click="openModal('edit', order.id)">
                <i class="bi bi-pencil-square"></i>
                <span class="d-inline-block d-md-none d-xl-inline-block">編輯</span>
              </button>
              <button class="btn btn-outline-danger" @click="openModal('remove', order.id)">
                <i class="bi bi-trash"></i>
                <span class="d-inline-block d-md-none d-xl-inline-block">移除</span>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <Pagination :pagination="pagination" v-show="pagination.total_pages > 1" @paginate="getOrders" />
  <OrderModal :order="order" type="admin" ref="editModal">
    <template v-slot="{order}">
      <form ref="form" class="container-fluid">
        <div class="modal-body table-responsive">
          <div class="table">
            <section class="container-md">
              <p class="row">
                <span class="col-sm">建立日期</span>
                <span class="col-sm">{{ order.create_at ? $filters.transDate(order.create_at) : '-' }}</span>
                <span class="col-sm">付款日期</span>
                <span class="col-sm">{{ order.paid_date ? $filters.transDate(order.paid_date) : '等待付款中' }}</span>
              </p>
            </section>
            <section class="container-md">
              <p class="row">
                <span class="col-sm-6">商品名稱</span>
                <span class="col-sm-2">單價</span>
                <span class="col-sm-2">數量</span>
                <span class="col-sm-2 text-sm-end">小計</span>
              </p>
              <p class="row" v-for="product in order.products" :key="product.id">
                <span class="col-sm-6">{{ product.product.title }}</span>
                <span class="col-sm-2 text-end">
                  <input v-model.number="product.product.price" type="number" class="form-control" @change="subTotal(product.id)" min="1" />
                </span>
                <span class="col-sm-2 text-sm-end">
                  <input v-model.number="product.qty" type="number" class="form-control" @change="subTotal(product.id)" min="1" />
                </span>
                <span class="col-sm-2 text-sm-end">{{ $filters.currency(product.total) }}</span>
              </p>
              <p class="row" v-if="hasCoupon">
                <span class="col-sm">折扣</span>
                <span class="col-sm text-sm-end">{{ discount }}</span>
                <span class="col-sm">優惠價</span>
                <span class="col-sm text-sm-end">{{ $filters.currency(order.total) }}</span>
              </p>
              <p class="row" v-else>
                <span class="col-sm-9">合計</span>
                <span class="col-sm-3 text-sm-end">{{ $filters.currency(order.total) }}</span>
              </p>
            </section>
            <section class="container-md">
              <p class="row">
                <span class="col-sm-3">地址</span>
                <span class="col-sm-9">
                  <input v-model="user.address" type="text" class="form-control w-100" />
                </span>
              </p>
              <p class="row">
                <span class="col-sm-3">電子信箱</span>
                <span class="col-sm-9">
                  <input v-model="user.email" type="email" class="form-control w-100" />
                </span>
              </p>
              <p class="row">
                <span class="col-sm">姓名</span>
                <span class="col-sm">
                  <input v-model="user.name" type="text" class="form-control" />
                </span>
                <span class="col-sm">電話</span>
                <span class="col-sm">
                  <input v-model="user.tel" type="tel" class="form-control" />
                </span>
              </p>
            </section>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" @click="editOrder(order)">確定</button>
          <button class="btn btn-danger" @click="hide">取消</button>
        </div>
      </form>
    </template>
  </OrderModal>
  <RemoveModal :item="order" :type="type" ref="removeModal" />
</template>
<script>
  import OrderModal from '@/components/OrderModal.vue'
  import Pagination from '@/components/PaginationBar.vue'
  import RemoveModal from '@/components/RemoveModal.vue'
  export default {
    name: 'OrderManage',
    inject: [ 'emitter' ],
    components: { OrderModal, Pagination, RemoveModal },
    methods: {
      getOrders ( page = 1 ) {
        this.isLoading = true
        this.$http.get( 
          `${ process.env.VUE_APP_API }/api/${ process.env.VUE_APP_PATH }/admin/orders`,
            {params: { page }
        }).then( res => {
          this.orders = res.data.orders
          this.pagination = res.data.pagination
        } ).catch( err => {
          this.emitter.emit( 'message', { type: 'danger', title: '取得訂單列表失敗', content: err.response.data.message } )
        } ).finally( () => {
          this.isLoading = false
        } )
      },
      editOrder ( tempOrder ) {
        const api = `${ process.env.VUE_APP_API }/api/${ process.env.VUE_APP_PATH }/admin/order/${ this.order.id }`
        this.order = {
          ...tempOrder,
          user: this.user,
          products: this.order.products
        }
        this.$http.put( api, { data: this.order } ).then( res => {
          this.emitter.emit( 'message', { type: 'success', title: '編輯訂單成功', content: res.data.message } )
          this.hide()
        } ).catch( err => {
          this.emitter.emit( 'message', { type: 'danger', title: '編輯訂單失敗', content: err.response.data.message } )
        } ).finally( () => {
          this.getOrders( this.pagination.current_page )
        } )
      },
      openModal ( type, id = '' ) {
        this.type = type
        if ( type === 'edit' ) {
          this.order = this.orders.find( item => item.id === id )
          this.user = JSON.parse( JSON.stringify( this.order.user ) )
          this.$refs.editModal.showModal()
        } else if ( type === 'remove' ) {
          this.order = this.orders.find( item => item.id === id )
          this.$refs.removeModal.showModal()
        } else if ( type === 'clear' ) {
          this.order = {}
          this.$refs.removeModal.showModal()
        }
      },
      hide () {
        this.$refs.editModal.hideModal()
      },
      subTotal ( productId ) {
        const product = this.order.products.find( item => item.id === productId )
        product.total = product.product.price * product.qty
        this.order.total = this.order.products.reduce( ( sum, item ) => sum + item.total, 0 )
        if ( this.hasCoupon ) {
          this.order.total = Math.round( this.order.total * ( this.order.coupon.percent / 100 ) )
        }
      }
    },
    computed: {
      hasCoupon () {
        return this.order.coupon && Object.keys( this.order.coupon ).length > 0
      },
      discount () {
        if ( this.hasCoupon ) {
          return `-${ this.$filters.currency( this.order.total_before_discount - this.order.total ) }`
        } else {
          return ''
        }
      }
    },
    data () {
      return {
        orders: [],
        order: {},
        pagination: {},
        isLoading: false,
        type: '',
        user: {
          address: '',
          email: '',
          name: '',
          tel: ''
        }
      }
    },
    mounted () {
      this.getOrders()
    }
  }
</script>