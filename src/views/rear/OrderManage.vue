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
                <tr class="row mx-0" v-for="order in orders" :key="order.id">
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
    <Pagination :pagination="pagination" v-show="pagination.total_pages > 1" @paginate="getOrders" />
    <OrderModal :order="order" type="admin" ref="editModal">
        <template v-slot="{order}">
            <form ref="form" class="container-fluid">
                <div class="modal-body table-responsive">
                    <div class="table">
                        <section class="container-md">
                            <p class="row">
                                <span class="col-6 col-sm">建立日期</span>
                                <span class="col-6 col-sm">{{ order.create_at ? $filters.transDate(order.create_at*1000) : '-' }}</span>
                                <span class="col-6 col-sm">付款日期</span>
                                <span class="col-6 col-sm">{{ order.is_paid ? $filters.transDate(order.paid_date*1000) : '等待付款中' }}</span>
                            </p>
                        </section>
                        <section class="container-md">
                            <p class="row">
                                <span class="col-sm-6">商品名稱</span>
                                <span class="col-4 col-sm-2 text-end">單價</span>
                                <span class="col-4 col-sm-2 text-center">數量</span>
                                <span class="col-4 col-sm-2 text-end">小計</span>
                            </p>
                            <p class="row" v-for="product in order.products" :key="product.id">
                                <span class="col-sm-6 mt-2">{{ product.product.title }}</span>
                                <span class="col-4 col-sm-2 text-end mt-2">{{product.product.price}}</span>
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
                                    <span class="col-3 col-sm-2 text-end  border border-danger">{{ $filters.currency(order.total) }}</span>
                                </template>
                            </p>
                        </section>
                        <section class="container-md">
                            <p class="row">
                                <span class="col-sm-3">地址</span>
                                <span class="col-sm-9">
                                    <input v-model="user.address" type="text" class="form-control w-100" />
                                </span>
                                <span class="col-sm-3">電子信箱</span>
                                <span class="col-sm-9">
                                    <input v-model="user.email" type="email" class="form-control w-100" />
                                </span>
                            </p>
                            <p class="row">                                
                                <span class="col-3 col-lg">姓名</span>
                                <span class="col-9 col-lg">
                                    <input v-model="user.name" type="text" class="form-control" />
                                </span>
                                <span class="col-3 col-lg">電話</span>
                                <span class="col-9 col-lg">
                                    <input v-model="user.tel" type="tel" class="form-control" />
                                </span>
                            </p>
                        </section>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" @click="editOrder(order)">確定</button>
                    <button class="btn btn-secondary" @click="hide">取消</button>
                </div>
            </form>
        </template>
    </OrderModal>
    <RemoveModal :item="order" type="訂單" ref="removeModal" />
</template>
<script>
    import OrderModal from '@/components/OrderModal.vue'
    import Pagination from '@/components/PaginationBar.vue'
    import RemoveModal from '@/components/RemoveModal.vue'
    export default {
        name: 'OrderManage',
        inject: ['emitter'],
        components: {OrderModal, Pagination, RemoveModal},
        methods: {
            getOrders (page = 1) {
                this.isLoading = true
                this.$http.get(
                    `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/orders`,
                    {
                        params: {page}
                    }).then(res => {
                        this.orders = res.data.orders
                        this.pagination = res.data.pagination
                    }).catch(err => {
                        this.emitter.emit('message', {type: 'danger', title: '取得訂單列表失敗', content: err.response.data.message})
                    }).finally(() => {
                        this.isLoading = false
                    })
            },
            editOrder (tempOrder) {
                const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/order/${this.order.id}`
                this.order = {
                    ...tempOrder,
                    user: this.user,
                    products: this.order.products
                }
                this.$http.put(api, {data: this.order}).then(res => {
                    this.emitter.emit('message', {type: 'success', title: '編輯訂單成功', content: res.data.message})
                    this.hide()
                }).catch(err => {
                    this.emitter.emit('message', {type: 'danger', title: '編輯訂單失敗', content: err.response.data.message})
                }).finally(() => {
                    this.getOrders(this.pagination.current_page)
                })
            },
            openModal (type, id = '') {
                this.type = type
                if (type === 'edit') {
                    this.order = this.orders.find(item => item.id === id)
                    this.user = JSON.parse(JSON.stringify(this.order.user))
                    this.$refs.editModal.showModal()
                } else if (type === 'remove') {
                    this.order = this.orders.find(item => item.id === id)
                    this.$refs.removeModal.showModal()
                } else if (type === 'clear') {
                    this.order = {}
                    this.$refs.removeModal.showModal()
                }
            },
            hide () {
                this.$refs.editModal.hideModal()
            },
            recount (productId, qty) {
                const index = this.order.products.findIndex(product => product.id === productId)
                this.order.products[index].total = this.order.products[index].product.price * qty
            }
        },
        computed: {
            products () {return Object.values(this.order?.products ?? {})},
            hasCoupon () {return this.products.some(product => product.coupon)},
            subTotal () {return this.products.reduce((sum, item) => sum + item.total, 0)},
            finalTotal () {return this.products.reduce((sum, item) => sum + item.final_total, 0)}
        },
        data () {
            return {
                orders: [],
                order: {},
                pagination: {},
                isLoading: false,
                type: '',
                user: {
                    address: '',
                    email: '',
                    name: '',
                    tel: ''
                }
            }
        },
        mounted () {
            this.getOrders()
        }
    }
</script>