<template>
    <LoadingC :is-full-page="true" :active="isLoading" />
    <div class="table-responsive-sm overflow-x-hidden" v-if="orderStore.orders">
        <table class="table table-striped">
            <thead class="sticky-top">
                <tr class="row mx-0">
                    <th class="col-md-1 col-lg-4">
                        <span class="d-block d-md-none d-lg-block">訂單編號</span>
                        <span class="d-none d-md-block d-lg-none">#</span>
                    </th>
                    <th class="col-6 col-md-3 col-lg-2">建立日期</th>
                    <th class="col-6 col-md-3 col-lg-2">付款日期</th>
                    <th class="col-6 col-md-2 col-lg-2 text-lg-end">金額</th>
                    <th class="col-6 col-md-2 col-lg-2 text-lg-center">動作</th>
                </tr>
            </thead>
            <tbody>
                <tr class="row mx-0" v-for="order in orderStore.orders" :key="order.id">
                    <td class="col-md-1 col-lg-4">
                        <span class="d-block d-md-none d-lg-block">{{ order.id }}</span>
                        <span class="d-none d-md-block d-lg-none">{{ order.num }}</span>
                    </td>
                    <td class="col-6 col-md-3 col-lg-2">{{ order.create_at ? $filters.transDate(order.create_at * 1000) : '-' }}</td>
                    <td class="col-6 col-md-3 col-lg-2">{{ order.paid_date ? $filters.transDate(order.paid_date * 1000) : '尚未付款' }}</td>
                    <td class="col-6 col-md-2 col-lg-2 text-lg-end">{{ $filters.currency(order.total) }}</td>
                    <td class="col-6 col-md-2 col-lg-2 text-lg-center">
                        <button class="btn btn-outline-primary w-100" @click="openModal('view',order.id)" v-if="order.paid_date">
                            <i class="bi bi-eye"></i>
                            檢視
                        </button>
                        <div class="btn-group btn-group-sm w-100" role="group" v-else>
                            <button class="btn btn-outline-primary" @click="openModal('view',order.id)">
                                <i class="bi bi-eye"></i>
                                檢視
                            </button>
                            <button class="btn btn-outline-info" @click="openModal('pay',order.id)">
                                <i class="bi bi-wallet"></i>
                                付款
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <Pagination :pagination="orderStore.pagination" @paginate="page=>orderStore.getOrders(page,'customer')" />
        <Modal :title="`訂單編號: ${orderStore?.order.id}`" ref="orderModal">
            <template v-slot:body>
                <div class="container">
                    <p class="row">
                        <span class="col-6 col-sm">建立日期</span>
                        <span class="col-6 col-sm">{{ orderStore.order?.create_at ? $filters.transDate(orderStore.order.create_at * 1000) : '-' }}</span>
                        <span class="col-6 col-sm">付款日期</span>
                        <span class="col-6 col-sm">{{orderStore.order?.paid_date ? $filters.transDate(orderStore.order.paid_date * 1000) : '等待付款中' }}</span>
                    </p>
                    <p class="row">
                        <span class="col-6 col-sm-3">留言</span>
                        <span class="col-6 col-sm">{{ orderStore.order?.message }}</span>
                    </p>
                </div>
                <hr />
                <div class="container">
                    <p class="row">
                        <span class="col-12 col-sm-6">商品名稱</span>
                        <span class="col-4 col-sm-2 text-end">單價</span>
                        <span class="col-4 col-sm-2 text-end">數量</span>
                        <span class="col-4 col-sm-2 text-end">小計</span>
                    </p>
                    <p class="row" v-for="product in orderStore.order?.products" :key="product.id">
                        <span class="col-12 col-sm-6">{{ product.product.title }}</span>
                        <span class="col-4 col-sm-2 text-end">{{ $filters.currency(product.product.price) }}</span>
                        <span class="col-4 col-sm-2 text-end">{{ product.qty }}</span>
                        <span class="col-4 col-sm-2 text-end">{{ $filters.currency(product.total) }}</span>
                    </p>
                    <p class="row border-top border-danger">
                        <template v-if="hasCoupon">
                            <span class="col-6 col-sm-2">總計</span>
                            <span class="col-6 col-sm-2 text-end">{{ $filters.currency(subTotal) }}</span>
                            <span class="col-6 col-sm-2">折扣</span>
                            <span class="col-6 col-sm-2 text-end">{{ $filters.currency(subTotal-finalTotal) }}</span>
                            <span class="col-6 col-sm-2 text-sm-end">優惠價</span>
                            <span class="col-6 col-sm-2 text-end border border-danger">{{ $filters.currency(finalTotal) }}</span>
                            <br />
                            <span class="text-info text-end">四捨五入至整數位，些微誤差不影響付款</span>
                        </template>
                        <template v-else>
                            <span class="col-9 col-sm-10">合計</span>
                            <span class="col-3 col-sm-2 text-end  border border-danger">{{ $filters.currency(orderStore.order?.total) }}</span>
                        </template>
                    </p>
                </div>
                <hr />
                <div class="container">
                    <p class="row">
                        <span class="col-3">地址</span>
                        <span class="col-9 text-end">{{ user?.address }}</span>
                    </p>
                    <p class="row">
                        <span class="col-4 col-sm-3">電子信箱</span>
                        <span class="col-8 col-sm-9 text-end">{{ user?.email }}</span>
                    </p>
                    <p class="row">
                        <span class="col-6 col-sm-2">姓名</span>
                        <span class="col-6 col-sm-4 text-end">{{ user?.name }}</span>
                        <span class="col-6 col-sm">電話</span>
                        <span class="col-6 col-sm text-end">{{ user?.tel }}</span>
                    </p>
                </div>
            </template>
            <template v-slot:footer>
                <button class="btn btn-primary" @click="closeModal('view')">返回</button>
            </template>
        </Modal>
        <Modal :title="`訂單編號: ${orderStore?.order.id}`" ref="payModal">
            <template v-slot:body>                
                    <form id="payform" @submit="payOrder" @reset="closeModal('pay')">
                        <div class="row">
                            <div class="col">付款方式</div>
                            <div class="col">
                                <select class="form-select" v-model="payMethod.value.value" v-bind:class="{ 'is-invalid': payMethod.errors.value.length }" @change="changeSchema">
                                    <option disabled>請選擇</option>
                                    <option value="credit-card">信用卡</option>
                                    <option value="bank-account">銀行帳戶</option>
                                    <option value="mobile-pay">行動支付</option>
                                </select>
                                <span class="invalid-feedback" v-show="payMethod.errorMessage">
                                    {{ payMethod.errorMessage }}
                                </span>
                            </div>
                        </div>
                        <section v-if="payMethod.value.value === 'credit-card'">
                            <div class="row mt-1">
                                <div class="col">發卡銀行</div>
                                <div class="col">
                                    <input class="form-control" type="text" v-model="bank" v-bind:class="{ 'is-invalid': errors.bank }" />
                                    <span class="invalid-feedback">
                                        {{ errorBag.bank?.[0] }}
                                    </span>
                                </div>
                            </div>
                            <div class="row mt-1">
                                <div class="col">卡號</div>
                                <div class="col">
                                    <input class="form-control" type="tel" v-model="cardNumber" v-bind:class="{ 'is-invalid': errors.cardNumber }" />
                                    <span class="invalid-feedback">
                                        {{ errorBag.cardNumber?.[0] }}
                                    </span>
                                </div>
                            </div>
                            <div class="row mt-1">
                                <div class="col">持有人</div>
                                <div class="col">
                                    <input class="form-control" type="text" v-model="cardHolder" v-bind:class="{ 'is-invalid': errors.cardHolder }" />
                                    <span class="invalid-feedback">
                                        {{ errorBag.cardHolder?.[0] }}
                                    </span>
                                </div>
                            </div>
                            <div class="row mt-1">
                                <div class="col">效期</div>
                                <div class="col">
                                    <input class="form-control" type="date" v-model="expiry" v-bind:class="{ 'is-invalid': errors.expiry}" />
                                    <span class="invalid-feedback">
                                        {{ errorBag.expiry?.[0] }}
                                    </span>
                                </div>
                            </div>
                            <div class="row mt-1">
                                <div class="col">檢核碼</div>
                                <div class="col">
                                    <input class="form-control" type="tel" v-model="cvv" v-bind:class="{ 'is-invalid': errors.cvv }" />
                                    <span class="invalid-feedback">
                                        {{ errorBag.cvv?.[0] }}
                                    </span>
                                </div>
                            </div>
                        </section>
                        <section v-if="payMethod.value.value === 'bank-account'">
                            <div class="row mt-1">
                                <div class="col">開戶總行</div>
                                <div class="col">
                                    <input class="form-control" type="text" v-model="headOffice" v-bind:class="{ 'is-invalid': errors.headOffice }" />
                                    <span class="invalid-feedback">
                                        {{ errors.headOffice }}
                                    </span>
                                </div>
                            </div>
                            <div class="row mt-1">
                                <div class="col">開戶分行</div>
                                <div class="col">
                                    <input class="form-control" type="text" v-model="branch" v-bind:class="{ 'is-invalid': errors.branch }" />
                                    <span class="invalid-feedback">
                                        {{ errorBag.branch?.[0] }}
                                    </span>
                                </div>
                            </div>
                            <div class="row mt-1">
                                <div class="col">帳號</div>
                                <div class="col">
                                    <input class="form-control" type="tel" v-model="accountNumber" v-bind:class="{ 'is-invalid': errors.accountNumber }" />
                                    <span class="invalid-feedback">
                                        {{ errorBag.accountNumber?.[0] }}
                                    </span>
                                </div>
                            </div>
                            <div class="row mt-1">
                                <div class="col">戶名</div>
                                <div class="col">
                                    <input class="form-control" type="text" v-model="accountHolder" v-bind:class="{ 'is-invalid': errors.accountHolder}" />
                                    <span class="invalid-feedback">
                                        {{ errorBag.accountHolder?.[0] }}
                                    </span>
                                </div>
                            </div>
                            <div class="row mt-1">
                                <div class="col">一次性密碼</div>
                                <div class="col">
                                    <input class="form-control" type="tel" v-model="otp" v-bind:class="{ 'is-invalid': errors.otp }" />
                                    <span class="invalid-feedback">
                                        {{ errorBag.otp?.[0] }}
                                    </span>
                                </div>
                            </div>
                        </section>
                        <section v-if="payMethod.value.value === 'mobile-pay'">
                            <div class="row mt-1">
                                <div class="col">支付服務</div>
                                <div class="col">
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" value="line-pay" name="paymentService" v-model="paymentService" v-bind:class="{'is-invalid':errors.paymentService}" />
                                        <label class="form-check-label">Line Pay</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" value="apple-pay" name="paymentService" v-model="paymentService" v-bind:class="{'is-invalid':errors.paymentService}" />
                                        <label class="form-check-label">Apple Pay</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" value="samsung-pay" name="paymentService" v-model="paymentService" v-bind:class="{'is-invalid':errors.paymentService}" />
                                        <label class="form-check-label">Samsung Pay</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" value="google-pay" name="paymentService" v-model="paymentService" v-bind:class="{'is-invalid':errors.paymentService}" />
                                        <label class="form-check-label">Google Pay</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" value="jeiko-pay" name="paymentService" v-model="paymentService" v-bind:class="{'is-invalid':errors.paymentService}" />
                                        <label class="form-check-label">街口支付</label>
                                    </div>
                                    <span class="invalid-feedback" v-bind:class="errorBag.paymentService?'d-block':'d-none'">
                                        {{ errorBag.paymentService?.[0] }}
                                    </span>
                                </div>
                            </div>
                            <div class="row mt-1">
                                <div class="col">付款代碼</div>
                                <div class="col">
                                    <input class="form-control" type="tel" v-model="paymentCode" v-bind:class="{ 'is-invalid': errors.paymentCode }" />
                                    <span class="invalid-feedback">
                                        {{ errorBag.paymentCode?.[0] }}
                                    </span>
                                </div>
                            </div>
                            <div class="row mt-1">
                                <div class="col">付款密碼</div>
                                <div class="col">
                                    <input class="form-control" type="password" v-model="paymentPassword" v-bind:class="{ 'is-invalid': errors.paymentPassword }" />
                                    <span class="invalid-feedback">
                                        {{ errorBag.paymentPassword?.[0] }}
                                    </span>
                                </div>
                            </div>
                        </section>
                    </form>
            </template>
            <template v-slot:footer>
                <input form="payform" type="submit" value="付款" class="btn btn-primary" />
                <input form="payform" type="reset" value="取消" class="btn btn-secondary" />
            </template>
        </Modal>
    </div>
    <h1 class="text-center vh-100" v-else>未送出任何訂單</h1>
</template>
<script setup>
        import {computed, inject, onMounted, reactive, ref, useTemplateRef, watch} from 'vue'
        import {useField, useFieldValue, useForm} from 'vee-validate'
        import useMessageStore from '@/stores/messages'
        import useLoadingStore from '@/stores/loading'
        import useOrderStore from '@/stores/orders'
        import Modal from '@/components/ModalComponent.vue'
        import Pagination from '@/components/PaginationBar.vue'
        const isLoading = useLoadingStore()
        const messageStore=useMessageStore()
        const orderStore = useOrderStore()
        const payOption=ref(0)
        const products = computed(() => Object.values(orderStore.order.products || {}))
        const user = computed(() => orderStore.order.user)
        const hasCoupon = computed(() => products.value.some(product => product.coupon))
        const subTotal = computed(() => products.value.reduce(
            (previous, current) => previous + current.total,
            0
        ))
        const finalTotal = computed(() => products.value.reduce(
            (previous, current) => previous + current.final_total,
            0
        ))
        const orderModal = useTemplateRef('orderModal')
        const payModal = useTemplateRef('payModal')
        const http=inject('http')
        const {defineField, errorBag, errors, handleSubmit} = useForm({
            initialValues: {
                paymentService: '',
                bank: '',
                cardNumber:'',
                cardHolder: '',
                expiry: '',
                cvv: '',
                headOffice: '',
                branch: '',
                accountNumber: '',
                accountHolder: '',
                otp: '',
                paymentCode: '',
                paymentPassword:'',
            },
            validationSchema: computed(function(){
                switch(payOption.value){
                    case 0: return{}
                    case 1: return{
                        bank: 'required',
                        cardNumber:'required|numeric',
                        cardHolder: 'required',
                        expiry: 'required',
                        cvv: 'required|digits:3'
                    }
                    case 2: return{
                        headOffice: 'required',
                        branch: 'required',
                        accountNumber: 'required|numeric',
                        accountHolder: 'required',
                        otp: 'required|numeric'
                    }
                    case 3: return {
                        paymentService:'required',
                        paymentCode: 'required|numeric',
                        paymentPassword:'required|numeric'
                    }
                }
            })
        })
        const payMethod=useField(
            'payMethod',
            undefined,
            {
                type: 'select',
                syncVModel: true,
                initialValue: ''
            }
        )
        const watcher=useFieldValue('payMethod')
        const [paymentService] = defineField('paymentService',{label:'此欄位'})
        const [bank] = defineField('bank',{label:'此欄位'})
        const [cardNumber] = defineField('cardNumber',{label:'此欄位'})
        const [cardHolder] = defineField('cardHolder',{label:'此欄位'})
        const [expiry] = defineField('expiry',{label:'此欄位'})
        const [cvv] = defineField('cvv',{label:'此欄位'})
        const [headOffice] = defineField('headOffice',{label:'此欄位'})
        const [branch] = defineField('branch',{label:'此欄位'})
        const [accountNumber] = defineField('accountNumber',{label:'此欄位'})
        const [accountHolder] = defineField('accountHolder',{label:'此欄位'})
        const [otp] = defineField('otp',{label:'此欄位'})
        const [paymentCode] = defineField('paymentCode',{label:'此欄位'})
        const [paymentPassword] = defineField('paymentPassword',{label:'此欄位'})
        const payOrder=handleSubmit(()=>{
            if(watcher.value){
                http({
                    url:`/api/${import.meta.env.VITE_PATH}/pay/${orderStore.order.id}`,
                    method: 'post'
                }).then(res=>{
                    if(res.data.success){
                        payModal.value.hideModal()
                        messageStore.pushMessage({
                            type: 'success',
                            title: '付款成功',
                            content: res.data.message
                        })
                        orderStore.getOrders(1, 'customer')
                    }else messageStore.pushMessage({
                        type: 'warning',
                        title: '付款失敗',
                        content: res.data.message
                    })
                }).catch(err=>
                    messageStore.pushMessage({
                        type: 'danger',
                        title: '付款發生錯誤',
                        content: err.response?.data.message
                    })
                )
            }else payMethod.setErrors('此欄位為必選')
        })
        const changeSchema = () => {
            switch(payMethod.value.value){
                case'credit-card':
                    payOption.value = 1
                    break
                case'bank-account':
                    payOption.value = 2
                    break
                case'mobile-pay':
                    payOption.value = 3
            }
        }
        const openModal = (type, orderId) => {
            Object.assign(orderStore.order, orderStore.orders.find(order => order.id === orderId))
            if (type === 'view') {
                orderModal.value.showModal();
            } else if (type === 'pay') {
                payModal.value.showModal();
            }
        }
        const closeModal = type => {
            if (type === 'view') {
                orderModal.value.hideModal();
            } else if (type === 'pay') {
                payModal.value.hideModal();
            }
        }
        watch(
            () => orderStore.order.id,
            newValue => {orderStore.getOrder(newValue)}
        )
        onMounted(() => {orderStore.getOrders(1, 'customer')})
</script>