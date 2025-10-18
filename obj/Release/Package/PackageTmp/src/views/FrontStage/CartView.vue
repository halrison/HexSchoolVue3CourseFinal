<template>
  <LoadingC :active="isLoading" :is-full-page="true" />
  <FormC class="container" v-if="cartList.length" @submit="addOrder" v-slot="{ errors, validate }">
    <table class="table table-borderless mx-auto w-100">
      <thead>
        <tr class="row">
          <th class="col-1">刪除</th>
          <th class="col-6">品名</th>
          <th class="col-2 text-end">數量</th>
          <th class="col-3 text-end">小計</th>
        </tr>
      </thead>
      <tbody>
        <tr class="row" v-for="cart,index in cartList" :key="cart.id">
          <td class="col-1">
            <button type="button" class="btn btn-outline-danger" @click="removeCart(cart.id)">
              <i class="bi bi-cart-x-fill"></i>
            </button>
          </td>
          <td class="col-6">{{ cart.product.title }}</td>
          <td class="col-2 text-end">
            <div class="input-group d-inline-block">
              <div class="input-group bg-light rounded">
                <div class="input-group-prepend">
                  <button class="btn btn-outline-dark border-0 py-2" type="button" @click="editCart(cart.id, cart.qty - 1)" :disabled="cart.qty < 2">
                    <i class="bi bi-dash"></i>
                  </button>
                </div>
                <input type="text" class="form-control border-0 text-center my-auto shadow-none bg-light" required min="1"
                       aria-label="Example text with button addon" aria-describedby="button-addon1"
                       v-model.number="cart.qty" :class="{ 'is-invalid': !cart.qty || cart.qty.toString().includes('.') }" @change="editCart(cart.id, cart.qty)" />
                <div class="input-group-append">
                  <button class="btn btn-outline-dark border-0 py-2" type="button" @click="editCart(cart.id, cart.qty + 1)">
                    <i class="bi-plus bi"></i>
                  </button>
                </div>
              </div>
            </div>
              <span v-if="!cart.qty" class="text-danger">商品數量為必填</span>
              <span v-else-if="cart.qty.toString().includes('.')" class="text-danger">商品數量需為整數</span>
          </td>
          <td class="col-3 text-end">{{ currency(cart.total) }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="row" v-if="final_total === total">
          <th class="col-6"></th>
          <td class="col-3 text-end">總計</td>
          <td class="col-3 text-end">{{ currency(total) }}</td>
        </tr>
        <tr class="row" v-else>
          <th class="col-1">折扣</th>
          <td class="col-6">{{ currency(total - final_total) }}</td>
          <th class="col-2 text-end">優惠價</th>
          <td class="col-3 text-end">{{ currency(final_total) }}</td>
        </tr>
      </tfoot>
    </table>
    <div class="input-group">
      <label class="input-group-text" for="code">輸入優惠碼</label>
      <input class="form-control" id="code" type="text" v-model="code" />
      <button class="btn btn-secondary" @click="applyCoupon(code)">
        <i class="bi bi-percent"></i>
        套用優惠碼
      </button>
      <button class="btn btn-danger" @click="removeCarts">
        <i class="bi bi-cart-x"></i>
        清空購物車
      </button>
    </div>
    <hr />
    <div class=" text-center">
      <div class="row">
        <div class="col-3">姓名</div>
        <div class="col-9">
          <FieldC class="form-control" rules="required" name="name" label="姓名" v-model="user.name" :class="{ 'is-invalid': errors['name'] }" />
          <ErrorMessage class="text-danger" name="name" />
        </div>
      </div>
      <div class="row">
        <div class="col-3">地址</div>
        <div class="col-9">
          <FieldC class="form-control" rules="required" name="address" label="地址" v-model="user.address" :class="{ 'is-invalid': errors['address'] }" />
          <ErrorMessage class="text-danger" name="address" />
        </div>
      </div>
      <div class="row">
        <div class="col-3">電話</div>
        <div class="col-9">
          <FieldC class="form-control" rules="required|isPhone" name="tel" label="電話" v-model="user.tel" :class="{ 'is-invalid': errors['tel'] }" />
          <ErrorMessage class="text-danger" name="tel" />
        </div>
      </div>
      <div class="row">
        <div class="col-3">電子信箱</div>
        <div class="col-9">
          <FieldC class="form-control" name="email" rules="required|email" label="電子信箱" v-model="user.email" :class="{ 'is-invalid': errors['email'] }" />
          <ErrorMessage class="text-danger" name="email" />
        </div>
      </div>
      <div class="row">
        <div class="col-3">留言</div>
        <div class="col-9">
          <textarea class="form-control" v-model="message" rows="2" cols="20"></textarea>
        </div>
      </div>
      <div class="row">
        <div class="my-1">
          <button class="btn btn-primary" type="submit" @submit="validate">前往付款</button>
        </div>
      </div>
    </div>
  </FormC>
  <h1 class="text-center" v-else>未選購任何商品</h1>
  <RemoveModal ref="modal" :item="cartItem" :type="type" />
</template>
<script setup>
  import useCartStore from "@/stores/carts"
  import useLoadingStore from "@/stores/loading"
  import useOrderStore from "@/stores/orders"
  import useMessageStore from "@/stores/messages"
  import RemoveModal from "@/components/RemoveModal.vue"

  import { currency, http } from "../../util"
  import { storeToRefs } from "pinia"
  import { onMounted, ref } from "vue"
  import { useRouter } from "vue-router"
  import { defineRule } from "vee-validate"
  import { max, min } from "@vee-validate/rules"


  const CartStore = useCartStore()
  const{ getCarts } = CartStore
  const { cartItem, cartList, total, final_total } = storeToRefs(CartStore)

  const { isLoading } = storeToRefs(useLoadingStore()) 
  const OrderStore = useOrderStore()
  const { pushMessage } = useMessageStore()

  const router = useRouter()

  const message = ref('')
  const type = ref('')
  const code = ref('')
  const modal = ref(null)
  const user = ref({})

  defineRule('min', min)
  defineRule('max', max)
  defineRule('isPhone', value => /(^0[2-8]{1}\d{7,8}$|^09\d{8}$)/.test(value) || '格式不符')
  onMounted(async function () {
    await getCarts()
  })

  async function addOrder () {
    await OrderStore.addOrder(user.value, message.value)
    cartList.value = []
    router.push({ path: '/order' })
  }
  function applyCoupon (code) {
    http.post(
      `/api/${import.meta.env.VITE_PATH}/coupon`,
      { data: { code } }
    ).then(function (response) {
      if (response.data.success) {
        pushMessage('success', response.data.message, `優惠價為${response.data.data.final_total}`)
        final_total.value = response.data.data.final_total
      } else {
        pushMessage('danger', response.data.message)
      }
    })
  }
  function editCart (cart_id, qty) {
    cartItem.value = cartList.value.find(cart => cart.id === cart_id)
    if(!qty.toString().includes('.'))CartStore.editCart(qty)
  }
  function removeCart (id) {
    cartItem.value = cartList.value.find(cart => cart.id === id)
    type.value = '單一購物車'
    modal.value.show()
  }
  function removeCarts () {
    type.value = '所有購物車'
    modal.value.show()
  }
</script>