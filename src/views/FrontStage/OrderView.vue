<template>
  <LoadingC :is-full-page="true" :active="isLoading" />
  <div class="table-responsive-sm overflow-x-hidden">
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
          <td class="col-md-3 col-lg-2">{{ new Date(order.create_at * 1000).toLocaleDateString() }}</td>
          <td class="col-md-3 col-lg-2">{{ order.paid_date ? new Date(order.paid_date * 1000).toLocaleDateString() : '尚未付款' }}</td>
          <td class="col-md-2 col-lg-2 text-lg-end">{{ currency(order.total) }}</td>
          <td class="col-md-3 col-lg-2 text-lg-center">
            <button class="btn btn-outline-primary" @click="openModal('view',order.id)">
              <i class="bi bi-eye"></i>
              檢視
            </button>
            <button class="btn btn-outline-info" @click="openModal('pay',order.id)" v-show="!order.paid_date">
              <i class="bi bi-wallet"></i>
              付款
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination :pagination="pagination" v-show="pagination.total_pages > 1" @paginate="page => getOrders(page, 'user')" />
    <OrderModal :order="order" type="user" ref="viewModal">
      <template v-slot="{order}">
        <div class="modal-body">
          <div class="container">
            <p class="row">
              <span class="col-sm">建立日期</span>
              <span class="col-sm">{{ new Date(order.create_at * 1000).toLocaleDateString() }}</span>
              <span class="col-sm">付款日期</span>
              <span class="col-sm">{{ order.paid_date ? new Date(order.paid_date * 1000).toLocaleDateString() : '等待付款中' }}</span>
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
            <p class="row" v-for="product in order.products">
              <span class="col-sm">{{ product.product.title }}</span>
              <span class="col-sm text-end">{{ product.product.price }}</span>
              <span class="col-sm text-end">{{ product.qty }}</span>
              <span class="col-sm text-end">{{ currency(product.total) }}</span>
            </p>
            <p class="row" v-if="Object.values(order.products || {}).some(product => product.coupon)">
              <span class="col-sm-9 text-end">總計</span>
              <span class="col-sm-3 text-end border-top border-danger">{{ currency(order.total * 100 / Object.values(order.products)[0].coupon.percent) }}</span>
              <span class="col-sm-3">折扣</span>
              <span class="col-sm-3 text-end">{{ currency(order.total * 100 / Object.values(order.products)[0].coupon.percent - order.total) }}</span>
              <span class="col-sm-3 text-end">優惠價</span>
              <span class="col-sm-3 text-end border border-danger">{{ currency(order.total) }}</span>
              <br />
              <span class="text-info text-end">四捨五入至整數位，些微誤差不影響付款</span>
            </p>
            <p class="row" v-else>
              <span class="col-sm-9 text-end">合計</span>
              <span class="col-sm text-end border-top border-danger">{{ currency(order.total) }}</span>
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
</template>

<script setup>
  import { storeToRefs } from "pinia"
  import { onMounted, ref } from "vue"
  import { currency } from "../../util"
  import useLoadingStore from "@/stores/loading"
  import useOrderStore from "@/stores/orders"
  import OrderModal from "@/components/OrderModal.vue"
  import PayModal from "@/components/PayModal.vue"
  import Pagination from "@/components/PaginationBar.vue"

  const viewModal = ref(null)
  const payModal = ref(null)
  const order = ref({})

  const { isLoading } = storeToRefs(useLoadingStore())

  const orderStore = useOrderStore()
  const { getOrders } = orderStore
  const { orders, pagination, user } = storeToRefs(orderStore)

  onMounted(function () {
    getOrders(1, 'user')
  })

  function hide(){ viewModal.value.hide() }
  function openModal (action, id) {
    order.value = orders.value.find(order => order.id === id)
    if (action === 'view') {
      viewModal.value.show()
    } else {
      payModal.value.show()
    }
  }
</script>

<style scoped>
  @media(width > 768px) {
    .text-lg-center {
      text-align: center;
    }
    .text-lg-end{
      text-align: right;
    }
  }
</style>