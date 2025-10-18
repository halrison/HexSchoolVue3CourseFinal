<template>
  <LoadingC :is-full-page="true" :active="isLoading" />
  <div class="table-responsive">
    <table class="table table-striped table-sm">
      <thead>
        <tr>
          <th>訂單編號</th>
          <th>建立日期</th>
          <th>付款日期</th>
          <th class="text-end">付款金額</th>
          <th>動作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.num">
          <td>{{ order.id }}</td>
          <td>{{ new Date(order.create_at*1000).toLocaleDateString() }}</td>
          <td>{{ order.paid_date ? new Date(order.paid_date*1000).toLocaleDateString() : '尚未付款' }}</td>
          <td class="text-end">{{ currency(order.total) }}</td>
          <td>
            <div class="btn-group btn-group-sm" role="group" aria-label="Basic example">
              <button class="btn btn-outline-primary" @click="openModal('view',order.id)">檢視</button>
              <button class="btn btn-outline-info" @click="openModal('pay',order.id)" v-show="!order.paid_date">付款</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination :pagination="pagination" v-show="pagination.total_pages>1" @paginate="page => getOrders(page, 'user')" />
    <OrderModal :order="order" type="user" ref="viewModal" />
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
  const  payModal = ref(null)
  const order = ref({})

  const { isLoading } = storeToRefs(useLoadingStore())

  const orderStore = useOrderStore()
  const { getOrders } = orderStore
  const { orders, pagination } = storeToRefs(orderStore)

  onMounted(function () {
    getOrders(1, 'user')
  })

  function openModal (action, id) {
    order.value = orders.value.find(order => order.id === id)
    if (action === 'view') {
      viewModal.value.show()
    } else {
      payModal.value.show()
    }
  }
</script>