<template>
    <LoadingC :active="isLoading" :is-full-page="true" />
    <FormC class="container" v-if="cartList?.length" @submit="addOrder" v-slot="{ errors }" :validation-schema="schema">
        <table class="table table-borderless mx-auto w-100">
            <thead>
                <tr class="row">
                    <th class="col-3 col-md-2">刪除</th>
                    <th class="col-9 col-md-5">品名</th>
                    <th class="col-6 col-md-3 text-center">數量</th>
                    <th class="col-6 col-md-2 text-end">小計</th>
                </tr>
            </thead>
            <tbody>
                <FieldArray name="cart">
                    <tr class="row" v-for="entry,index in cartList" :key="entry.id">
                        <td class="col-3 col-md-2">
                            <button type="button" class="btn btn-outline-danger" @click="openModal(entry.id)">
                                <i class="bi bi-cart-x-fill"></i>
                                <span class="d-none d-sm-inline-block ms-1">刪除</span>
                            </button>
                        </td>
                        <td class="col-9 col-md-5">{{ entry.product.title }}</td>
                        <td class="col-6 col-md-3 text-end">
                            <div class="input-group d-inline-block">
                                <div class="input-group bg-light rounded">
                                    <div class="input-group-prepend">
                                        <button class="btn btn-outline-dark border-0 py-2" type="button" @click="editCart(entry.id, entry.qty - 1)" v-bind:disabled="entry.qty < 2">
                                            <i class="bi bi-dash"></i>
                                        </button>
                                    </div>
                                    <FieldC label="此欄位" class="form-control border-0 text-center my-auto shadow-none bg-light" type="number" rules="required|integer|min_value:1"
                                            v-model="entry.qty" v-bind:class="{ 'is-invalid': errors['qty'] }" :name="`cartList[${index}].qty`" />
                                    <!-- <input type="text" required min="1"
                                           aria-label="Example text with button addon" aria-describedby="button-addon1"
                                           v-model.number="entry.qty" v-bind:class="{ 'is-invalid': !entry.qty || entry.qty.toString().includes('.') }" @change="editCart(entry.id, entry.qty)" /> -->
                                    <div class="input-group-append">
                                        <button class="btn btn-outline-dark border-0 py-2" type="button" @click="editCart(entry.id, entry.qty + 1)">
                                            <i class="bi-plus bi"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <ErrorMessage class="text-danger" :name="`carts[${index}].qty`" />
                        </td>
                        <td class="col-6 col-md-2 text-end">{{ $filters.currency(entry.total) }}</td>
                    </tr>
                </FieldArray>
            </tbody>
            <tfoot>
                <tr class="row" v-if="final_total === total">
                    <th class="col-6"></th>
                    <td class="col-3 text-end">總計</td>
                    <td class="col-3 text-end">{{ $filters.currency(total) }}</td>
                </tr>
                <tr class="row" v-else>
                    <td class="col d-none d-sm-block">合計</td>
                    <td class="col d-none d-sm-block">{{ $filters.currency(total) }}</td>
                    <th class="col">折扣</th>
                    <td class="col">{{ $filters.currency(total - final_total) }}</td>
                    <th class="col text-end">優惠價</th>
                    <td class="col text-end">{{ $filters.currency(final_total) }}</td>
                </tr>
            </tfoot>
        </table>
        <div class="d-block d-sm-none">
            <div class="input-group mb-1">
                <label class="input-group-text" for="code">輸入優惠碼</label>
                <input class="form-control" type="text" id="code" v-model="code" />
            </div>
            <div class="btn-group w-100">
                <button class="btn btn-secondary" @click="applyCoupon(code)">
                    <i class="bi bi-percent"></i>
                    套用優惠碼
                </button>
                <button class="btn btn-danger" @click="openModal('')">
                    <i class="bi bi-cart-x"></i>
                    清空購物車
                </button>
            </div>
        </div>
        <div class="d-none d-sm-block">
            <div class="input-group">
                <label class="input-group-text" for="code">輸入優惠碼</label>
                <input class="form-control" type="text" id="code" v-model="code" />
                <button class="btn btn-secondary" @click="applyCoupon(code)">
                    <i class="bi bi-percent"></i>
                    套用優惠碼
                </button>
                <button class="btn btn-danger" @click="openModal('')">
                    <i class="bi bi-cart-x"></i>
                    清空購物車
                </button>
            </div>
        </div>
        <hr />
        <div class="text-center">
            <div class="row">
                <div class="col-4">姓名</div>
                <div class="col-8">
                    <FieldC class="form-control" as="input" name="name" type="text" label="此欄位" v-bind:class="{ 'is-invalid': errors['name'] }" />
                    <ErrorMessage class="text-danger" name="name" />
                </div>
            </div>
            <div class="row mt-1">
                <div class="col-4">地址</div>
                <div class="col-8">
                    <FieldC class="form-control" as="input" type="text" name="address" label="此欄位" v-bind:class="{ 'is-invalid': errors['address'] }" />
                    <ErrorMessage class="text-danger" name="address" />
                </div>
            </div>
            <div class="row mt-1">
                <div class="col-4">電話</div>
                <div class="col-8">
                    <FieldC class="form-control" as="input" type="tel" name="tel" v-bind:class="{ 'is-invalid': errors['tel'] }" />
                    <ErrorMessage class="text-danger" name="tel" />
                </div>
            </div>
            <div class="row mt-1">
                <div class="col-4">電子信箱</div>
                <div class="col-8">
                    <FieldC class="form-control" name="email" type="email" as="input" label="此欄位" v-bind:class="{ 'is-invalid': errors['email'] }" />
                    <ErrorMessage class="text-danger" name="email" />
                </div>
            </div>
            <div class="row mt-1">
                <div class="col-4">留言</div>
                <div class="col-8">
                    <FieldC class="form-control" name="message" as="textarea" rows="2" cols="20" v-model="message" />
                </div>
            </div>
            <div class="row">
                <div class="my-2">
                    <input class="btn btn-primary w-50" type="submit" value="前往付款" />
                </div>
            </div>
        </div>
        <Modal size="md" ref="modal">
            <div class="modal-header">{{cartItem.id?'刪除選購商品':'清空購物車'}}</div>
            <div class="modal-body">
                <p>您確定要{{modalTitle}}嗎？</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="$refs.modal.hideModal()">取消</button>
                <button type="button" class="btn btn-danger" @click="removeCarts">確認</button>
            </div>
        </Modal>
    </FormC>
    <h1 class="text-center vh-100" v-else>未選購任何商品</h1>
</template>
<script>
       import Modal from '@/components/ModalComponent.vue'
       import CartStore from '@/stores/carts.js'
       export default {
           name: 'CartView',
           inject: ['emitter'],
           mixins: [CartStore],
           components: {
               Modal,
           },
           methods: {
                openModal (id = '') {
                   this.cartItem = this.cartList.find(cart => cart.id === id) ?? {}
                   this.modalTitle = id ? `刪除${this.cartItem.product.title}` : '清空購物車'
                   this.$refs.modal.showModal()
               },
               removeCarts () {
                   this.$http.delete(this.cartItem.id ? `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart/${this.cartItem.id}` : `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/carts`)
                       .then(({data}) => {
                           if (data.success) {
                                this.$refs.modal.hideModal()
                                this.emitter?.emit(
                                   'message',
                                   {
                                       title: '移除購物車成功',
                                       content: data.message,
                                       type: 'success'
                                   }
                               )
                               this.getCarts()
                               this.emitter?.emit('refresh-cart')
                           } else {
                               this.emitter?.emit(
                                   'message',
                                   {
                                       title: '移除購物車失敗',
                                       content: data.message,
                                       type: 'warning'
                                   }
                               )
                           }
                       }).catch(err => {
                           this.emitter?.emit(
                               'message',
                               {
                                   title: '移除購物車發生錯誤',
                                   content: err.response?.data.message,
                                   type: 'danger'
                               }
                           )
                       })
               },
               editCart (id, qty) {
                   if (qty < 1 || qty.toString().includes('.')) {
                       return
                   }
                   this.isLoading = true
                   this.$http.put(
                       `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart/${id}`,
                       {
                           data: {
                               product_id: id,
                               qty
                           }
                       }).then(res => {
                           if (res.data.success) {
                               this.emitter.emit(
                                   'message',
                                   {
                                       type: 'success',
                                       title: '編輯購物車成功',
                                       content: res.data.message
                                   }
                               )
                           } else {
                               this.emitter.emit(
                                   'message',
                                   {
                                       type: 'warning',
                                       title: '編輯購物車失敗',
                                       content: res.data.message
                                   }
                               )
                           }
                       }).catch(err => {
                           this.emitter.emit(
                               'message',
                               {
                                   type: 'danger',
                                   title: '編輯購物車發生錯誤',
                                   content: err.response?.data.message
                               }
                           )
                       }
                       ).finally(() => {
                           this.getCarts()
                           this.emitter.emit('refresh-cart')
                       })
               },
               addOrder (user) {
                   if (this.cartList.length) {
                       const order = {
                           user,
                           message: this.message,
                       }
                       this.$http.post(
                           `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/order`,
                           {data: order}
                       ).then(res => {
                           if (res.data.success) {
                               this.emitter.emit(
                                   'message',
                                   {
                                       type: 'success',
                                       title: '送出訂單成功',
                                       content: res.data.message
                                   }
                               )
                               this.$router.push('/order')
                           } else {
                               this.emitter.emit(
                                   'message',
                                   {
                                       type: 'warning',
                                       title: '送出訂單失敗',
                                       content: res.data.message
                                   }
                               )
                           }
                       }).catch(err => {
                           this.emitter.emit(
                               'message',
                               {
                                   type: 'danger',
                                   title: '送出訂單發生錯誤',
                                   content: err.response?.data.message
                               }
                           )
                       })
                   } else return
               },
               applyCoupon (code) {
                   this.$http.post(
                       `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/coupon`,
                       {data: {code}}
                   ).then(res => {
                       if (res.data.success) {
                           this.emitter.emit(
                               'message',
                               {
                                   type: 'success',
                                   title: '套用優惠券成功',
                                   content: res.data.message
                               }
                           )
                           this.final_total = res.data.data.final_total
                       } else {
                           this.emitter.emit(
                               'message',
                               {
                                   type: 'warning',
                                   title: '套用優惠券失敗',
                                   content: res.data.message
                               }
                           )
                       }
                   }).catch(err => {
                       this.emitter.emit(
                           'message',
                           {
                               type: 'danger',
                               title: '套用優惠券發生錯誤',
                               content: err.response?.data.message
                           }
                       )
                   })
               }
           },
           computed: {
               schema(){
                   return {
                       name: 'required',
                       address: 'required',
                       tel (value) {
                           if (value) {
                               const phoneNumber = /0[2-9]\d{8}|0[2-9]{2}\d{7}/
                               return phoneNumber.test(value) ? true : '格式錯誤'
                           } else return '此欄位為必填'
                       },
                       email: 'required|email'
                   }
               }
           },
           data () {
               return {
                   code: '',
                   message: '',
                   type: '購物車',
                   modalTitle: ''
               }
           },
           mounted () {
               this.getCarts()
           }
       }
</script>
<style scoped>
    [type="number"] {
        -moz-appearance: textfield;
    }

        [type="number"]::-webkit-inner-spin-button,
        [type="number"]::-webkit-outer-spin-button {
            display: none;
        }

</style>