<template>
  <div class="modal fade" tabindex="-1" ref="DOM">
    <div class="modal-dialog modal-lg" role="dialog">
      <div class="modal-content">
        <div class="modal-header">訂單編號：{{ order.id }}</div>
        <form v-if="prop.type==='admin'" ref="form">
          <div class="modal-body">
            <table class="table">
              <thead class="container">
                <tr class="row">
                  <th class="col">建立日期</th>
                  <td class="col">{{ new Date(order.create_at*1000).toLocaleDateString() }}</td>
                  <th class="col">付款日期</th>
                  <td class="col">{{ order.paid_date ? new Date(order.paid_date*1000).toLocaleDateString() : '等待付款中' }}</td>
                </tr>
              </thead>
              <tbody class="container">
                <tr class="row">
                  <th class="col-6">商品名稱</th>
                  <th class="col">單價</th>
                  <th class="col">數量</th>
                  <th class="col text-end">小計</th>
                </tr>
                <tr class="row" v-for="product in order.products">
                  <td class="col-6">{{ product.product.title }}</td>
                  <td class="col text-end">
                    <input v-model.number="product.product.price" type="number" class="form-control" @change="subTotal(product.id)" min="1" />
                  </td>
                  <td class="col text-end">
                    <input v-model.number="product.qty" type="number" class="form-control" @change="subTotal(product.id)" min="1" />
                  </td>
                  <td class="col text-end">{{ currency(product.total) }}</td>
                </tr>
                <tr class="row" v-if="Object.values(order.products || {}).some(product => product.coupon)">
                  <td class="col">折扣</td>
                  <td class="col text-end">{{ Object.values(order.products || {}).reduce((prev, current) => prev + current.total - current.final_total, 0) }}</td>
                  <td class="col">優惠價</td>
                  <td class="col text-end">{{ currency(order.total) }}</td>
                </tr>
                <tr class="row" v-else>
                  <th class="col-9">合計</th>
                  <td class="col text-end">{{ currency(order.total) }}</td>
                </tr>
              </tbody>
              <tfoot class="container">
                <tr class="row">
                  <th class="col-3">地址</th>
                  <td class="col">
                    <input v-model="user.address" type="text" class="form-control w-100" />
                  </td>
                </tr>
                <tr class="row">
                  <th class="col-3">電子信箱</th>
                  <td class="col">
                    <input v-model="user.email" type="email" class="form-control w-100" />
                  </td>
                </tr>
                <tr class="row">
                  <th class="col">姓名</th>
                  <td class="col">
                    <input v-model="user.name" type="text" class="form-control" />
                  </td>
                  <th class="col">電話</th>
                  <td class="col">
                    <input v-model="user.tel" type="tel" class="form-control" />
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="EditOrder">確定</button>
            <button class="btn btn-danger" @click="hide">取消</button>
          </div>
        </form>
        <template v-else>
          <div class="modal-body">
            <div class="container">
              <p class="row">
                <span class="col">建立日期</span>
                <span class="col">{{ new Date(order.create_at*1000).toLocaleDateString() }}</span>
                <span class="col">付款日期</span>
                <span class="col">{{ order.paid_date ? new Date(order.paid_date*1000).toLocaleDateString() : '等待付款中' }}</span>
              </p>
              <p class="row">
                <span class="col-3">留言</span>
                <span class="col">{{ order.message }}</span>
              </p>
            </div>
            <hr />
            <div class="container">
              <p class="row">
                <span class="col">商品名稱</span>
                <span class="col text-end">單價</span>
                <span class="col text-end">數量</span>
                <span class="col text-end">小計</span>
              </p>
              <p class="row" v-for="product in order.products">
                <span class="col">{{ product.product.title }}</span>
                <span class="col text-end">{{ product.product.price }}</span>
                <span class="col text-end">{{ product.qty }}</span>
                <span class="col text-end">{{ currency(product.total) }}</span>
              </p>
              <p class="row" v-if="Object.values(order.products || {}).some(product => product.coupon)">
                <span class="col-9 text-end">總計</span>
                <span class="col-3 text-end border-top border-danger">{{ currency(order.total*100/Object.values(order.products)[0].coupon.percent) }}</span>
                <span class="col-3">折扣</span>
                <span class="col-3 text-end">{{ currency(order.total*100/Object.values(order.products)[0].coupon.percent-order.total) }}</span>
                <span class="col-3 text-end">優惠價</span>
                <span class="col-3 text-end border border-danger">{{ currency(order.total) }}</span>
                <br />
                <span class="text-info text-end">四捨五入至整數位，些微誤差不影響付款</span>
              </p>
              <p class="row" v-else>
                <span class="col-9 text-end">合計</span>
                <span class="col text-end border-top border-danger">{{ currency(order.total) }}</span>
              </p>
            </div>
            <hr />
            <div class="container">
              <p class="row">
                <span class="col-3">地址</span>
                <span class="col">{{ user.address }}</span>
              </p>
              <p class="row">
                <span class="col-3">電子信箱</span>
                <span class="col">{{ user.email }}</span>
              </p>
              <p class="row">
                <span class="col">姓名</span>
                <span class="col">{{ user.name }}</span>
                <span class="col">電話</span>
                <span class="col">{{ user.tel }}</span>
              </p>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="hide">返回</button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { onMounted, ref, watch } from "vue"
  import { Modal } from "bootstrap"
  import { storeToRefs } from "pinia"
  import { currency } from "../util"
  import useOrderStore from "@/stores/orders"

  const DOM = ref(null)
  const form = ref(null)
  const prop = defineProps([ 'order', 'type' ])
  const orderStore = useOrderStore()
  const { editOrder, getOrder, getOrders } = orderStore
  const { order, user } = storeToRefs(orderStore)
  let modal

  onMounted(function () {
    modal = new Modal(DOM.value)
  })
  defineExpose({ show })
  watch(
    () => prop.order,
    async function (newValue) {
      await getOrder(newValue.id)
      user.value = order.value.user || newValue.user
    },
    { deep: true }
  )

  function show () {
    modal.show() 
  }
  function hide () { 
    modal.hide()
    getOrders(1,prop.type)
  }
  function subTotal (id) {
    const product = Object.values(order.value.products).find(p => p.id === id)
    order.value.total -= product.total
    product.total = product.qty * product.product.price
    order.value.total += product.qty * product.product.price
  }
  function EditOrder () {
    editOrder()
    if (form.value.checkValidity()) hide()
  }
</script>
