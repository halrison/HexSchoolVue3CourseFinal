<template>
  <LoadingC :is-full-page="true" :active="isLoading" />
  <div class="table-responsive-sm overflow-x-hidden" v-if="orders">
    <table class="table table-striped">
      <thead class="sticky-top">
        <tr class="row mx-0">
          <th class="col-md-1 col-lg-4">
            <span class="d-block d-md-none d-lg-block">訂單編號</span>
            <span class="d-none d-md-block d-lg-none">#</span>
          </th>
          <th class="col-md-3 col-lg-2">建立日期</th>
          <th class="col-md-3 col-lg-2">付款日期</th>
          <th class="col-md-2 col-lg-2 text-lg-end">金額</th>
          <th class="col-md-3 col-lg-2 text-lg-center">動作</th>
        </tr>
      </thead>
      <tbody>
        <tr class="row mx-0" v-for="order in orders" :key="order.id">
          <td class="col-md-1 col-lg-4">
            <span class="d-block d-md-none d-lg-block">{{ order.id }}</span>
            <span class="d-none d-md-block d-lg-none">{{ order.num }}</span>
          </td>
          <td class="col-md-3 col-lg-2">{{ order.create_at ? $filters.transDate(order.create_at * 1000) : '-' }}</td>
          <td class="col-md-3 col-lg-2">{{ order.paid_date ? $filters.transDate(order.paid_date * 1000) : '尚未付款' }}</td>
          <td class="col-md-2 col-lg-2 text-lg-end">{{ $filters.currency(order.total) }}</td>
          <td class="col-md-3 col-lg-2 text-lg-center">
            <button class="btn btn-outline-primary" @click="openModal('view',order.id)">
              <i class="bi bi-eye"></i>
              檢視
            </button>
            <button class="btn btn-outline-info ms-1" @click="openModal('pay',order.id)" v-show="!order.paid_date">
              <i class="bi bi-wallet"></i>
              付款
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination :pagination="pagination" v-show="pagination.total_pages > 1" @paginate="getOrders" />
    <OrderModal :order="order" type="user" ref="viewModal">
      <template v-slot="{order}">
        <div class="modal-body">
          <div class="container">
            <p class="row">
              <span class="col-sm">建立日期</span>
              <span class="col-sm">{{ order.create_at ? $filters.transDate(order.create_at * 1000) : '-' }}</span>
              <span class="col-sm">付款日期</span>
              <span class="col-sm">{{order.paid_date ? $filters.transDate(order.paid_date * 1000) : '等待付款中' }}</span>
            </p>
            <p class="row">
              <span class="col-sm-3">留言</span>
              <span class="col-sm">{{ order.message }}</span>
            </p>
          </div>
          <hr />
          <div class="container">
            <p class="row">
              <span class="col-sm">商品名稱</span>
              <span class="col-sm text-end">單價</span>
              <span class="col-sm text-end">數量</span>
              <span class="col-sm text-end">小計</span>
            </p>
            <p class="row" v-for="product in order.products" :key="product.id">
              <span class="col-sm">{{ product.product.title }}</span>
              <span class="col-sm text-end">{{ product.product.price }}</span>
              <span class="col-sm text-end">{{ product.qty }}</span>
              <span class="col-sm text-end">{{ $filters.currency(product.total) }}</span>
            </p>
            <p class="row" v-if="hasCoupon">
              <span class="col-sm-9 text-end">總計</span>
              <span class="col-sm-3 text-end border-top border-danger">{{ $filters.currency(subTotal) }}</span>
              <span class="col-sm-3">折扣</span>
              <span class="col-sm-3 text-end">{{ $filters.currency(discount) }}</span>
              <span class="col-sm-3 text-end">優惠價</span>
              <span class="col-sm-3 text-end border border-danger">{{ $filters.currency(order.total) }}</span>
              <br />
              <span class="text-info text-end">四捨五入至整數位，些微誤差不影響付款</span>
            </p>
            <p class="row" v-else>
              <span class="col-sm-9 text-end">合計</span>
              <span class="col-sm text-end border-top border-danger">{{ $filters.currency(order.total) }}</span>
            </p>
          </div>
          <hr />
          <div class="container">
            <p class="row">
              <span class="col-sm-3">地址</span>
              <span class="col-sm">{{ user.address }}</span>
            </p>
            <p class="row">
              <span class="col-sm-3">電子信箱</span>
              <span class="col-sm">{{ user.email }}</span>
            </p>
            <p class="row">
              <span class="col-sm">姓名</span>
              <span class="col-sm">{{ user.name }}</span>
              <span class="col-sm">電話</span>
              <span class="col-sm">{{ user.tel }}</span>
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" @click="hide">返回</button>
        </div>
      </template>
    </OrderModal>
    <PayModal :order="order" ref="payModal" />
  </div>
  <h1 class="text-center vh-100" v-else>未送出任何訂單</h1>
</template>
<script>
  import OrderModal from '@/components/OrderModal.vue';
  import PayModal from '@/components/PayModal.vue';
  import Pagination from '@/components/PaginationBar.vue';
  export default {
    name: 'OrderView',
    inject: [ 'emitter' ],
    components: { OrderModal, PayModal, Pagination },
    methods: {
      getOrder ( id ) {
        this.isLoading = true;
        this.$http.get( `${ process.env.VUE_APP_API }/api/${ process.env.VUE_APP_PATH }/order/${ id }`
        ).then( response => {
          if ( response.data.success ) {
            this.order = response.data.order;
            this.user = response.data.order.user;
          } else { this.emitter.emit( 'message', { type: 'warning', title: '取得訂單明細失敗', content: response.data.message } ) }
        } ).catch( error => {
          this.emitter.emit( 'message', { type: 'danger', title: '取得訂單明細失敗', content: error.response.data.message } );
        } ).finally( () => {
          this.isLoading = false;
        } );
      },
      getOrders ( page = 1 ) {
        this.isLoading = true;
        this.$http.get(
          `${ process.env.VUE_APP_API }/api/${ process.env.VUE_APP_PATH }/orders`,
          {
            params: { page }
          } ).then( response => {
            if ( response.data.success ) {
              this.orders = response.data.orders;
              this.pagination = response.data.pagination;
            } else { this.emitter.emit( 'message', { type: 'warning', title: '取得訂單列表失敗', content: response.data.message } ) }
          } ).catch( error => {
            this.emitter.emit( 'message', { type: 'danger', title: '取得訂單列表失敗', content: error.response.data.message } );
          } ).finally( () => {
            this.isLoading = false;
          } );
      },
      openModal ( type, orderId ) {
        this.order = this.orders.find(order=>order.id===orderId);
        if ( type === 'view' ) {
          this.$refs.viewModal.showModal();
        } else if ( type === 'pay' ) {
          this.$refs.payModal.showModal();
        }
      },
      hide () {
        this.$refs.viewModal.hideModal();
      },
    },
    computed: {
      hasCoupon () {
        return Object.values( this.order.products || {} ).some( product => product.coupon );
      },
      subTotal () {
        return this.order.total * 100 / Object.values( this.order.products )[ 0 ].coupon.percent;
      },
      discount () {
        return this.subTotal - this.order.total;
      }
    },
    watch: {
      'order.id' ( newOrderId ) {
        this.getOrder( newOrderId )
      }
    },
    data () {
      return {
        orders: [],
        order:{},
        user: {},
        pagination: {},
        isLoading: false,
      };
    },
    created () {
      this.getOrders();
    }
  };
</script>