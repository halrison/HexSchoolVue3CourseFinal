<template>
    <LoadingC :active="isLoading" :is-full-page="true" />
    <form class="container" v-if="cartStore.carts?.length>0" @submit="addOrder">
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
                <tr class="row" v-for="cart in cartStore.carts" :key="cart.id">
                    <td class="col-3 col-md-2">
                        <button type="button" class="btn btn-outline-danger" @click="openModal(cart.id)">
                            <i class="bi bi-cart-x-fill"></i>
                            <span class="d-none d-sm-inline-block ms-1">刪除</span>
                        </button>
                    </td>
                    <td class="col-9 col-md-5">{{ cart.product.title }}</td>
                    <td class="col-6 col-md-3 text-end">
                        <div class="input-group d-inline-block">
                            <div class="input-group bg-light rounded">
                                <div class="input-group-prepend">
                                    <button class="btn btn-outline-dark border-0 py-2" type="button" @click="editCart(cart.id, cart.qty - 1)" v-bind:disabled="cart.qty < 2">
                                        <i class="bi bi-dash"></i>
                                    </button>
                                </div>
                                <input type="text" class="form-control border-0 text-center my-auto shadow-none bg-light" required min="1"
                                       aria-label="Example text with button addon" aria-describedby="button-addon1"
                                       v-model.number="cart.qty" v-bind:class="{ 'is-invalid': !cart.qty || cart.qty.toString().includes('.') }" @change="editCart(cart.id, cart.qty)" />
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
                    <td class="col-6 col-md-2 text-end">{{ $filters.currency(cart.total) }}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr class="row" v-if="cartStore.subTotal.value === cartStore.finalTotal.value">
                    <th class="col-6"></th>
                    <td class="col-3 text-end">總計</td>
                    <td class="col-3 text-end">{{ $filters.currency(cartStore.subTotal.value) }}</td>
                </tr>
                <tr class="row" v-else>
                    <td class="col d-none d-sm-block">合計</td>
                    <td class="col d-none d-sm-block">{{ $filters.currency(cartStore.subTotal.value) }}</td>
                    <th class="col">折扣</th>
                    <td class="col">{{ $filters.currency(cartStore.subTotal.value - cartStore.finalTotal.value) }}</td>
                    <th class="col text-end">優惠價</th>
                    <td class="col text-end">{{ $filters.currency(cartStore.finalTotal.value) }}</td>
                </tr>
            </tfoot>
        </table>
        <div class="d-block d-sm-none">
            <div class="input-group mb-1">
                <label class="input-group-text" for="code">輸入優惠碼</label>
                <input class="form-control" type="text" id="code" v-model="code.value.value" />
            </div>
            <div class="btn-group w-100">
                <button class="btn btn-secondary" @click="applyCoupon(code.value.value)">
                    <i class="bi bi-percent"></i>
                    套用優惠碼
                </button>
                <button class="btn btn-danger" @click="openModal('')">
                    <i class="bi bi-cart-x"></i>
                    清空購物車
                </button>
            </div>
        </div>
        <div class=" d-none d-sm-block">
            <div class="input-group">
                <label class="input-group-text" for="code">輸入優惠碼</label>
                <input class="form-control" type="text" id="code" v-model="code.value.value" />
                <button class="btn btn-secondary" @click="applyCoupon(code.value.value)">
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
        <div class=" text-center">
            <div class="row">
                <div class="col-4">姓名</div>
                <div class="col-8">
                    <input class="form-control" type="text" v-model="name" v-bind:class="{ 'is-invalid': errors['name'] }" />
                    <span class="text-danger" name="name">{{ errors['name'] }}</span>
                </div>
            </div>
            <div class="row mt-1">
                <div class="col-4">地址</div>
                <div class="col-8">
                    <input class="form-control" type="text" v-model="address" v-bind:class="{ 'is-invalid': errors['address'] }" />
                    <span class="text-danger" name="address">{{ errors['address'] }}</span>
                </div>
            </div>
            <div class="row mt-1">
                <div class="col-4">電話</div>
                <div class="col-8">
                    <input class="form-control" type="tel" v-model="tel" v-bind:class="{ 'is-invalid': errors['tel'] }" />
                    <span class="text-danger" name="tel">{{ errors['tel'] }}</span>
                </div>
            </div>
            <div class="row mt-1">
                <div class="col-4">電子信箱</div>
                <div class="col-8">
                    <input type="email" class="form-control" v-model="email" v-bind:class="{ 'is-invalid': errors['email'] }" />
                    <span class="text-danger" name="email">{{ errors['email'] }}</span>
                </div>
            </div>
            <div class="row mt-1">
                <div class="col-4">留言</div>
                <div class="col-8">
                    <textarea class="form-control" v-model="message" rows="2" cols="20"></textarea>
                </div>
            </div>
            <div class="row">
                <div class="my-2">
                    <input class="btn btn-primary w-50" type="submit" value="前往付款" />
                </div>
            </div>
        </div>
        <Modal ref="modal" title="刪除購物車">
            <template v-slot:body>
                <p>要{{action}}嗎？</p>
            </template>
            <template v-slot:footer>
                <button type="button" class="btn btn-secondary" @click="modal.hideModal()">取消</button>
                <button type="button" class="btn btn-danger" @click="removeCarts">確定</button>
            </template>
        </Modal>
    </form>
    <h1 class="text-center vh-100" v-else>未選購任何商品</h1>
</template>
<script setup>
    import {inject, onMounted, reactive, ref, useTemplateRef} from 'vue'
    import {useRouter} from 'vue-router'
    import {useForm, useField} from 'vee-validate'
    import useCartStore from '@/stores/carts'
    import useLoadingStore from '@/stores/loading'
    import Modal from '@/components/ModalComponent.vue'
    const cartStore = useCartStore()
    const isLoading = useLoadingStore()
    const router = useRouter()
    const http = inject('http')
    const messageStore = inject('message')
    const user = reactive({})
    const action=ref('')
    const modal = useTemplateRef('modal')
    const code = useField('code')
    const {defineField, errors, handleSubmit} = useForm({
        initialErrors: {
            name:'',
            email:'',
            tel:'',
            address:''
        },
        validationSchema: {
            name: 'required',
            email: 'required|email',
            tel: val => isPhone(val),
            address: 'required'
        }
    })
    const [name] = defineField('name', {label: '此欄位'})
    const [email] = defineField('email', {label: '此欄位'})
    const [tel] = defineField('tel', {label: '此欄位'})
    const [address] = defineField('address', {label: '此欄位'})
    const [message] = defineField('message')
    const addOrder = handleSubmit(() => {
        if (cartStore.carts.length) {
            const order = {
                user: {
                    name,
                    email,
                    address,
                    tel
                },
                message
            }
            http({
                url: `/api/${import.meta.env.VITE_PATH}/order`,
                method: 'post',
                data: order
            }).then(res => {
                if (res.data.success) {
                    router.push('/order');
                } else {
                    messageStore.pushMessage({
                        type: 'warning',
                        title: '送出訂單失敗',
                        content: res.data.message
                    })
                }
            }).catch(err => {
                messageStore.pushMessage({
                    type: 'danger',
                    title: '送出訂單失敗',
                    content: err.response?.data.message
                })
            })
        }else return
    })
    const applyCoupon = code => {
        http({
            url: `/api/${import.meta.env.VITE_PATH}/coupon`,
            method: 'post',
            data: {
                data: {code}
            }
        }).then(res => {
            if (res.data.success) {
                messageStore.pushMessage({
                    type: 'success',
                    title: '套用優惠券成功',
                    content: res.data.message
                })
                cartStore.finalTotal.value = res.data.data.final_total;
            } else messageStore.pushMessage({
                type: 'warning',
                title: '套用優惠券失敗',
                content: res.data.message
            })
        }).catch(err => {
            messageStore.pushMessage({
                type: 'danger',
                title: '套用優惠券失敗',
                content: err.response?.data.message
            })
        })
    }
    const editCart = (id, qty) => {
        if (qty < 1 || qty.toString().includes('.')) return
        isLoading.value = true
        http({
            url: `/api/${import.meta.env.VITE_PATH}/cart/${id}`,
            method: 'put',
            data: {
                data: {
                    product_id: id,
                    qty
                }
            }
        }).then(res => {
            if (res.data.success) {
                messageStore.pushMessage({
                    type: 'success',
                    title: '編輯購物車成功',
                    content: res.data.message
                })
                cartStore.getCarts()
            }
            else messageStore.pushMessage({
                type: 'warning',
                title: '編輯購物車失敗',
                content: res.data.message
            })
        }).catch(err => {
            messageStore.pushMessage({
                type: 'danger',
                title: '編輯購物車失敗',
                content: err.response?.data.message
            })
        }).finally(() => {isLoading.value = false})
    }
    const isPhone = function (val) {
        if (val) {
            const phoneNumber = /0[2-9]\d{8}|0[2-9]{2}\d{7}/
            return phoneNumber.test(val) ? true : '格式錯誤'
        } else return '此欄位為必填'
    }
    const openModal = id => {
        if (id) {
            Object.assign(
                cartStore.cart,
                cartStore.carts.find(cart => cart.id === id)
            )
            action.value = `移除${cartStore.cart.product.title}`
        }else {
            cartStore.cart.length = 0
            action.value = '清空購物車'
        }
        modal.value.showModal()
    }
    const removeCarts = () => {
        http({
            url: cartStore.cart.id ? `/api/${import.meta.env.VITE_PATH}/cart/${cartStore.cart.id}` : `/api/${import.meta.env.VITE_PATH}/carts`,
            method: 'delete'
        }).then(res => {
            if (res.data.success) {
                modal.value.hideModal()
                messageStore.pushMessage({
                    title: '移除購物車成功',
                    message: res.data.message,
                    type: 'success'
                })                
                cartStore.getCarts()
            } else {
                messageStore.pushMessage({
                    title: '移除購物車失敗',
                    message: res.data.message,
                    type: 'warning'
                })
            }
        }).catch(err => {
            messageStore.pushMessage({
                title: '移除購物車發生錯誤',
                message: err.response?.data.message,
                type: 'danger'
            })
        })
    }
    onMounted(() => {cartStore.getCarts()})
</script>