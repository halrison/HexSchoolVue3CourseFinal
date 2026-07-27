<template>
    <LoadingC :is-full-page="true" :active="isLoading" />
    <button class="btn btn-outline-danger float-end mt-1" @click="openModal('clear')">
        <i class="bi bi-x-lg me-1"></i>
        清空所有訂單
    </button>
    <div class="table-responsive-sm overflow-x-hidden mt-5">
        <table class="table table-striped">
            <thead>
                <tr class="row mx-0">
                    <th class="col-8 col-sm-1 col-lg-4">
                        <span class="d-block d-sm-none d-lg-block">訂單編號</span>
                        <span class="d-none d-sm-block d-lg-none">#</span>
                    </th>
                    <th class="col-4 col-sm-2 col-lg-2 text-end">付款金額</th>
                    <th class="col-6 col-sm-3 col-lg-2">建立日期</th>
                    <th class="col-6 col-sm-3 col-lg-2">付款日期</th>
                    <th class=" col-sm-3 col-lg-2 text-center">動作</th>
                </tr>
            </thead>
            <tbody>
                <tr class="row mx-0" v-for="order in orderStore.orders" :key="order.id">
                    <td class="col-8 col-sm-1 col-lg-4">
                        <span class="d-block d-sm-none d-lg-block">{{ order.id }}</span>
                        <span class="d-none d-sm-block d-lg-none">{{ order.num }}</span>
                    </td>
                    <td class="col-4 col-sm-2 col-lg-2 text-end">{{ $filters.currency(order.total) }}</td>
                    <td class="col-6 col-sm-3 col-lg-2">{{ order.create_at ? $filters.transDate(order.create_at * 1000) : '-' }}</td>
                    <td class="col-6 col-sm-3 col-lg-2">{{ order.paid_date ? $filters.transDate(order.paid_date * 1000) : '尚未付款' }}</td>
                    <td class=" col-sm-3 col-lg-2 text-center">
                        <div class="btn-group btn-group-sm w-100" role="group" aria-label="Basic example">
                            <button class="btn btn-outline-warning" @click="openModal('edit', order.id)">
                                <i class="bi bi-pencil-square"></i>
                                <span class="ms-1 d-inline-block d-sm-none d-md-inline-block">編輯</span>
                            </button>
                            <button class="btn btn-outline-danger" @click="openModal('remove', order.id)">
                                <i class="bi bi-trash"></i>
                                <span class="ms-1 d-inline-block d-sm-none d-md-inline-block">移除</span>
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <Pagination :pagination="orderStore.pagination" v-show="orderStore.pagination.total_pages > 1" @paginate="orderStore.getOrders" />
    <Modal :title="`訂單編號: ${orderStore?.order.id}`" ref="orderModal" size="xl">
        <template v-slot:body>
            <form ref="orderForm" class="container-fluid" id="orderForm" @submit="editOrder" @reset="orderModal.hideModal()">
                <div class="table-responsive">
                    <div class="table">
                        <section class="container-md border-bottom border-body">
                            <p class="row">
                                <span class="col-6 col-sm">建立日期</span>
                                <span class="col-6 col-sm">{{ orderStore.order.create_at ? $filters.transDate(orderStore.order.create_at*1000) : '-' }}</span>
                                <span class="col-6 col-sm">付款日期</span>
                                <span class="col-6 col-sm">{{ orderStore.order.is_paid ? $filters.transDate(orderStore.order.paid_date*1000) : '等待付款中' }}</span>
                            </p>
                        </section>
                        <section class="container-md">
                            <p class="row">
                                <span class="col-sm-6">商品名稱</span>
                                <span class="col-4 col-sm-2 text-end">單價</span>
                                <span class="col-4 col-sm-2 text-center">數量</span>
                                <span class="col-4 col-sm-2 text-end">小計</span>
                            </p>
                            <p class="row" v-for="product in products" :key="product.id">
                                <span class="col-sm-6 mt-2">{{ product.product.title }}</span>
                                <span class="col-4 col-sm-2 text-end mt-2">{{$filters.currency(product.product.price)}}</span>
                                <span class="col-4 col-sm-2 text-center">
                                    <input v-model.number="product.qty" type="number" class="form-control" @change="recount(product.id,product.qty)" min="1" />
                                </span>
                                <span class="col-4 col-sm-2 text-end mt-2">{{ $filters.currency(product.total) }}</span>
                            </p>
                            <p class="row border-top border-danger">
                                <template v-if="hasCoupon">
                                    <span class="col-6 col-sm-2">總計</span>
                                    <span class="col-6 col-sm-2 text-end">{{ $filters.currency(subTotal) }}</span>
                                    <span class="col-6 col-sm-2">折扣</span>
                                    <span class="col-6 col-sm-2 text-end">-{{ $filters.currency(subTotal - finalTotal) }}</span>
                                    <span class="col-6 col-sm-2">優惠價</span>
                                    <span class="col-6 col-sm-2 text-end border border-danger">{{ $filters.currency(finalTotal) }}</span>
                                </template>
                                <template v-else>
                                    <span class="col-9 col-sm-10 text-sm-end">合計</span>
                                    <span class="col-3 col-sm-2 text-end  border border-danger">{{ $filters.currency(orderStore.order.total) }}</span>
                                </template>
                            </p>
                        </section>
                        <section class="container-md">
                            <p class="row">
                                <span class="col-sm-3">地址</span>
                                <span class="col-sm-9">
                                    <input v-model="address" type="text" class="form-control w-100" />
                                </span>
                                <span class="col-sm-3">電子信箱</span>
                                <span class="col-sm-9">
                                    <input v-model="email" type="email" class="form-control w-100" />
                                </span>
                            </p>
                            <p class="row">
                                <span class="col-3 col-lg">姓名</span>
                                <span class="col-9 col-lg">
                                    <input v-model="name" type="text" class="form-control" />
                                </span>
                                <span class="col-3 col-lg">電話</span>
                                <span class="col-9 col-lg">
                                    <input v-model="tel" type="tel" class="form-control" />
                                </span>
                            </p>
                        </section>
                    </div>
                </div>
            </form>
        </template>
        <template v-slot:footer>
            <input class="btn btn-primary" type="submit" value="確定" form="orderForm" />
            <input class="btn btn-secondary" type="reset" value="取消" form="orderForm" />
        </template>
    </Modal>
    <Modal title="移除訂單" ref="removeModal">
        <template v-slot:body>
            <p>您要{{ action }}嗎？</p>
        </template>
        <template v-slot:footer>
            <button type="button" class="btn btn-secondary" @click="removeModal.hideModal()">取消</button>
            <button type="button" class="btn btn-danger" @click="removeOrder">確定</button>
        </template>
    </Modal>
</template>
<script setup>
    import {computed, inject, onMounted, reactive, ref, useTemplateRef} from 'vue'
    import {useForm} from 'vee-validate'
    import useLoadingStore from '@/stores/loading'
    import useMessageStore from '@/stores/messages'
    import useOrderStore from '@/stores/orders'
    import Pagination from '@/components/PaginationBar.vue'
    import Modal from '@/components/ModalComponent.vue'
    const isLoading = useLoadingStore()
    const messageStore = useMessageStore()
    const orderStore = useOrderStore()
    const http = inject('http')
    const products = reactive(Object.values(orderStore.order.products || {}))
    const user = reactive({})
    const action = ref('')
    const hasCoupon = computed(() => products.value?.some(product => product.coupon))
    const subTotal = computed(() => products.value.reduce(
        (previous, current) => previous + current.total,
        0
    ))
    const finalTotal = computed(() => products.value.reduce(
        (previous, current) => previous + current.final_total,
        0
    ))
    const orderModal = useTemplateRef('orderModal')
    const removeModal = useTemplateRef('removeModal')
    const {defineField, handleSubmit, errors, errorBag, setValues} = useForm({
        initialValues:{
            name: '',
            address: '',
            tel: '',
            email: ''
        },
        validationSchema: {
            name: 'required',
            address: 'required',
            tel: val => isPhone(val),
            email: 'required|email'
        }
    })
    const [name] = defineField('name', {label: '此欄位'})
    const [address] = defineField('address', {label: '此欄位'})
    const [tel] = defineField('tel', {label: '此欄位'})
    const [email] = defineField('email', {label: '此欄位'})
    const editOrder = handleSubmit( tempOrder => {
        Object.assign(
            orderStore.order,
            {
                ...tempOrder,
                user:user,
                products
            }
        )
        http({
            url: `/api/${import.meta.env.VITE_PATH}/admin/order/${orderStore.order.id}`,
            data: {data:orderStore.order},
            method: 'put'
        }).then(res => {
            if (res.data.success) {
                messageStore.pushMessage({
                    type: 'success', 
                    title: '編輯訂單成功',
                    message: res.data.message
                })
                orderModal.value.hideModal()
                orderStore.getOrders(orderStore.pagination.current_page)
            } else messageStore.pushMessage({
                type: 'warning',
                title: '編輯訂單失敗', 
                message: res.data.message})
        }).catch(err => {
            messageStore.pushMessage({
                type: 'danger', 
                title: '編輯訂單失敗', 
                message: err.response?.data.message
            })
        })
    })
    const isPhone = function (val) {
        if (val) {
            const phoneNumber = /0[2-9]\d{8}|0[2-9]{2}\d{7}/
            return phoneNumber.test(val) ? true : '格式錯誤'
        } else return '電話號碼為必填'
    }
    const openModal = (type, id = '') => {
        if (type === 'edit') {
            Object.assign(orderStore.order, orderStore.orders.find(item => item.id === id))
            Object.assign(user, JSON.parse(JSON.stringify(orderStore.order.user)))
            setValues(user)
            orderModal.value.showModal()
        } else if (type === 'remove') {
            Object.assign(orderStore.order, orderStore.orders.find(item => item.id === id))
            action.value = `移除訂單編號 ${orderStore.order.id} `
            removeModal.value.showModal()
        } else if (type === 'clear') {
            orderStore.order.length = 0
            action.value = '清空所有訂單'
            removeModal.value.showModal()
        }
    }
    const removeOrder = () => {
        http({
            url: orderStore.order.id ? `/api/${import.meta.env.VITE_PATH}/admin/order/${orderStore.order.id}` : `/api/${import.meta.env.VITE_PATH}/admin/orders/all`,
            method: 'delete'
        }).then(({data}) => {
            if (data.success) {
                removeModal.value.hideModal()
                messageStore.pushMessage({
                    title: '移除訂單成功',
                    message: data.message,
                    type: 'success'
                })
                orderStore.getOrders(1, 'admin')
            } else {
                messageStore.pushMessage({
                    title: '移除訂單失敗',
                    message: data.message,
                    type: 'warning'
                })
            }
        }).catch(err => {
            messageStore.pushMessage({
                title: '移除訂單發生錯誤',
                message: err.response?.data.message,
                type: 'danger'
            })
        })
    }
    const recount = (productId, qty) => {
        const index = products.findIndex(product => product.id === productId)
        products[index].total = products[index].product.price * qty
    }
    onMounted(() => {orderStore.getOrders(1, 'admin')})
</script>