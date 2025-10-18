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
          <td class="col-sm-3 col-lg-2">{{ new Date(order.create_at * 1000).toLocaleDateString() }}</td>
          <td class="col-sm-3 col-lg-2">{{ order.paid_date ? new Date(order.paid_date * 1000).toLocaleDateString() : '尚未付款' }}</td>
          <td class="col-sm-2 col-lg-2 text-lg-end">{{ currency(order.total) }}</td>
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
  <Pagination :pagination="pagination" v-show="pagination.total_pages > 1" @paginate="page => getOrders(page, 'admin')" />
  <OrderModal :order="order" type="admin" ref="editModal">
    <template v-slot="{order}">
      <form ref="form" class="container-fluid">
        <div class="modal-body table-responsive">
          <div class="table">
            <section class="container-md">
              <p class="row">
                <span class="col-sm">建立日期</span>
                <span class="col-sm">{{ new Date(order.create_at * 1000).toLocaleDateString() }}</span>
                <span class="col-sm">付款日期</span>
                <span class="col-sm">{{ order.paid_date ? new Date(order.paid_date * 1000).toLocaleDateString() : '等待付款中' }}</span>
              </p>
            </section>
            <section class="container-md">
              <p class="row">
                <span class="col-sm-6">商品名稱</span>
                <span class="col-sm-2">單價</span>
                <span class="col-sm-2">數量</span>
                <span class="col-sm-2 text-sm-end">小計</span>
              </p>
              <p class="row" v-for="product in order.products">
                <span class="col-sm-6">{{ product.product.title }}</span>
                <span class="col-sm-2 text-end">
                  <input v-model.number="product.product.price" type="number" class="form-control" @change="subTotal(product.id)" min="1" />
                </span>
                <span class="col-sm-2 text-sm-end">
                  <input v-model.number="product.qty" type="number" class="form-control" @change="subTotal(product.id)" min="1" />
                </span>
                <span class="col-sm-2 text-sm-end">{{ currency(product.total) }}</span>
              </p>
              <p class="row" v-if="Object.values(order.products || {}).some(product => product.coupon)">
                <span class="col-sm">折扣</span>
                <span class="col-sm text-sm-end">{{ Object.values(order.products || {}).reduce((prev, current) => prev + current.total - current.final_total, 0) }}</span>
                <span class="col-sm">優惠價</span>
                <span class="col-sm text-sm-end">{{ currency(order.total) }}</span>
              </p>
              <p class="row" v-else>
                <span class="col-sm-9">合計</span>
                <span class="col-sm-3 text-sm-end">{{ currency(order.total) }}</span>
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
          <button class="btn btn-primary" @click="EditOrder">確定</button>
          <button class="btn btn-danger" @click="hide">取消</button>
        </div>
      </form>
    </template>
  </OrderModal>
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
  import { currency } from "../../util"

  const editModal = ref(null)
  const removeModal = ref(null)
  const form = ref(null)
  const type = ref('')
  const order = ref({})

  const orderStore = useOrderStore()
  const { editOrder, getOrders } = orderStore
  const { orders, pagination, user } = storeToRefs(orderStore)

  const { isLoading } = storeToRefs(useLoadingStore())

  onMounted(function () {
    getOrders(1, 'admin')
  })

  function hide () { editModal.value.hide() }
  function subTotal (id) {
    const product = Object.values(order.value.products).find(p => p.id === id)
    order.value.total -= product.total
    product.total = product.qty * product.product.price
    order.value.total += product.qty * product.product.price
  }
  function EditOrder () {
    editOrder()
    if (form.value.checkValidity()) editModal.value.hide()
  }
  function openModal (action, id = '') {
    order.value = orders.value.find(o => o.id === id) || {}
    if (action === 'edit') {
      editModal.value.show()
    } else if (action === 'remove') {
      type.value = '單一訂單'
      removeModal.value.show()
    } else {
      type.value = '所有訂單'
      removeModal.value.show()
    }
  }
</script>