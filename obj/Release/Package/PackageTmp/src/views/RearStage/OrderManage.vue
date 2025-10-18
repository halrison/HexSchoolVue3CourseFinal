<template>
  <LoadingC :is-full-page="true" :active="isLoading" />
    <button class="btn btn-danger float-end" @click="openModal('clear')">刪除所有訂單</button>
    <table class="table">
      <thead>
        <tr>
          <th>訂單編號</th>
          <th>建立日期</th>
          <th>付款日期</th>
          <th class="text-end">付款金額</th>
          <th class="text-center">動作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.num">
          <td>{{ order.id }}</td>
          <td>{{ new Date(order.create_at * 1000).toLocaleDateString() }}</td>
          <td>{{ order.paid_date ? new Date(order.paid_date * 1000).toLocaleDateString() : '尚未付款' }}</td>
          <td class="text-end" v-text="order.total"></td>
          <td class="text-end">
            <div class="btn-group btn-group-sm" role="group" aria-label="Basic example">
              <button class="btn btn-outline-primary" @click="openModal('edit', order.id)">編輯</button>
              <button class="btn btn-outline-danger" @click="openModal('remove', order.id)">移除</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination :pagination="pagination" v-show="pagination.total_pages > 1" @paginate="page => getOrders(page, 'admin')"/>
    <OrderModal :order="order" type="admin" ref="editModal" />
    <RemoveModal :item="order" :type="type" ref="removeModal" />
</template>

<script setup>
  import { storeToRefs } from "pinia"
  import { onMounted, ref } from "vue"
  import OrderModal from "@/components/OrderModal.vue"
  import RemoveModal from "@/components/RemoveModal.vue"
  import Pagination from "@/components/PaginationBar.vue"
  import useLoadingStore from "@/stores/loading"
  import useOrderStore from "@/stores/orders"

  const editModal = ref(null)
  const removeModal = ref(null)
  const type=ref('')
  const order = ref({})

  const orderStore = useOrderStore()
  const { getOrders } = orderStore
  const { orders, pagination } = storeToRefs(orderStore)

  const { isLoading } = storeToRefs(useLoadingStore())

  onMounted(function () {
    getOrders(1, 'admin')
  })

  function openModal (action, id = '') {
    order.value = orders.value.find(o => o.id === id) || {}
    if (action === 'edit') {
      editModal.value.show()
    } else if (action === 'remove'){
      type.value = '單一訂單'
      removeModal.value.show()
    } else {
      type.value = '所有訂單'
      removeModal.value.show()
    }
  }
</script>