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
    <Modal size="lg" :title="`訂單編號：${order.id}`" ref="orderModal">
        <FormC ref="form" class="container-fluid" v-slot="{ errors }" @submit="editOrder" :initial-values="order" :initial-errors="{}">
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
                        <FieldArray name="products">
                            <p class="row" v-for="(product,idx) in products" :key="product.id">
                                <span class="col-sm-6 mt-2">{{ product.product.title }}</span>
                                <span class="col-4 col-sm-2 text-end mt-2">{{product.product.price}}</span>
                                <span class="col-4 col-sm-2 text-center">
                                    <FieldC type="number" class="form-control" rules="integer|min:1" v-model.number="product.qty" @change="recount(product.id,product.qty)" :name="`products[${idx}].qty`" v-bind:class="{'is-invalid':errors[`products[${idx}].qty`]}" />
                                    <ErrorMessage :name="`products[${idx}].qty`" class="invalid-feedback" />
                                </span>
                                <span class="col-4 col-sm-2 text-end mt-2">{{ $filters.currency(product.total) }}</span>
                            </p>
                        </FieldArray>
                        <p class="row border-top border-danger">
                            <template v-if="hasCoupon">
                                <span class="col-6 col-sm-2">總計</span>
                                <span class="col-6 col-sm-2 text-end">{{ $filters.currency(subTotal) }}</span>
                                <span class="col-6 col-sm-2">折扣</span>
                                <span class="col-6 col-sm-2 text-end">{{ $filters.currency(subTotal - finalTotal) }}</span>
                                <span class="col-6 col-sm-2">優惠價</span>
                                <span class="col-6 col-sm-2 text-end border border-danger">{{ $filters.currency(finalTotal) }}</span>
                            </template>
                            <template v-else>
                                <span class="col-9 col-sm-10 text-sm-end">合計</span>
                                <span class="col-3 col-sm-2 text-end  border border-danger">{{ $filters.currency(order.total) }}</span>
                            </template>
                        </p>
                    </section>
                    <hr />
                    <section class="container-md">
                        <p class="row">
                            <span class="col-sm-3">地址</span>
                            <span class="col-sm-9">
                                <FieldC name="address" label="地址" rules="required" type="text" class="form-control w-100" v-model="user.address" v-bind:class="{'is-invalid':errors.address}" />
                                <ErrorMessage name="address" class="invalid-feedback" />
                            </span>
                            <span class="col-sm-3">電子信箱</span>
                            <span class="col-sm-9">
                                <FieldC name="email" label="電子信箱" rules="required|email" type="email" class="form-control w-100" v-model="user.email" v-bind:class="{'is-invalid':errors.email}" />
                                <ErrorMessage name="email" class="invalid-feedback" />
                            </span>
                        </p>
                        <p class="row">
                            <span class="col-3 col-lg">姓名</span>
                            <span class="col-9 col-lg">
                                <FieldC name="name" label="姓名" rules="required" type="text" class="form-control" v-model="user.name" v-bind:class="{'is-invalid':errors.name}" />
                                <ErrorMessage name="name" class="invalid-feedback" />
                            </span>
                            <span class="col-3 col-lg">電話</span>
                            <span class="col-9 col-lg">
                                <FieldC name="tel" label="電話" rules="required|digits:10" type="tel" class="form-control" v-model="user.tel" v-bind:class="{'is-invalid':errors.tel}" />
                                <ErrorMessage name="tel" class="invalid-feedback" />
                            </span>
                        </p>
                        <p class="row">
                            <span class="col-sm-3">留言</span>
                            <span class="col-sm-9">
                                <FieldC name="message" label="留言" as="textarea" class="form-control" v-model="order.message" />
                            </span>
                        </p>
                    </section>
                </div>
            </div>
            <div class="modal-footer">
                <input class="btn btn-primary" type="submit" value="確定" />
                <input class="btn btn-secondary" type="reset" @click="$refs.orderModal.hideModal()" value="取消" />
            </div>
        </FormC>
    </Modal>
    <Modal ref="removeModal" title="移除訂單">
        <div class="modal-body">
            <p v-if="order.id">要刪除訂單編號{{order.id}}嗎?</p>
            <p v-else>要清除所有訂單嗎</p>
        </div>
        <div class="modal-footer">
            <button class="btn btn-danger" @click="removeOrder">確定</button>
            <button class="btn btn-secondary" @click="$refs.removeModal.hideModal()">取消</button>
        </div>
    </Modal>
</template>
<script>
    import Modal from '@/components/ModalComponent.vue'
    import Pagination from '@/components/PaginationBar.vue'
    export default {
        name: 'OrderManage',
        inject: ['emitter'],
        components: {Modal, Pagination},
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
                    this.getOrders(this.pagination.current_page)
                }).catch(err => {
                    this.emitter.emit('message', {type: 'danger', title: '編輯訂單失敗', content: err.response.data.message})
                })
            },
            openModal (type, id = '') {
                this.type = type
                if (type === 'edit') {
                    this.order = this.orders.find(item => item.id === id)
                    this.user = JSON.parse(JSON.stringify(this.order.user))
                    this.$refs.orderModal.showModal()
                } else if (type === 'remove') {
                    this.order = this.orders.find(item => item.id === id)
                    this.$refs.removeModal.showModal()
                } else if (type === 'clear') {
                    this.order = {}
                    this.$refs.removeModal.showModal()
                }
            },
            recount (productId, qty) {
                const index = this.order.products.findIndex(product => product.id === productId)
                this.order.products[index].total = this.order.products[index].product.price * qty
            },
            removeOrder () {
                this.$http.delete(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/order/${this.order.id}`)
                    .then(({data}) => {
                        if (data.success) {
                            this.emitter?.emit('message', {title: '移除訂單成功', message: data.message, type: 'success'})
                            this.hideModal()
                            this.getOrders(this.pagination.current_page)
                        } else {
                            this.emitter?.emit('message', {title: '移除訂單失敗', message: data.message, type: 'warning'})
                        }
                    }).catch(err => {
                        this.emitter?.emit('message', {title: '移除訂單發生錯誤', message: err, type: 'danger'})
                    })
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