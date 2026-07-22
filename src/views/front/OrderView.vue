<template>
    <LoadingC :is-full-page="true" :active="isLoading" />
    <div class="table-responsive-sm overflow-x-hidden" v-if="orders">
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
                <tr class="row mx-0" v-for="order in orders" :key="order.id">
                    <td class="col-md-1 col-lg-4">
                        <span class="d-block d-md-none d-lg-block">{{ order.id }}</span>
                        <span class="d-none d-md-block d-lg-none">{{ order.num }}</span>
                    </td>
                    <td class="col-6 col-md-3 col-lg-2">{{ order.create_at ? $filters.transDate(order.create_at * 1000) : '-' }}</td>
                    <td class="col-6 col-md-3 col-lg-2">{{ order.paid_date ? $filters.transDate(order.paid_date * 1000) : '尚未付款' }}</td>
                    <td class="col-6 col-md-2 col-lg-2 text-lg-end">{{ $filters.currency(order.total) }}</td>
                    <td class="col-6 col-md-2 col-lg-2 text-lg-center">
                        <button class="btn btn-outline-primary w-100" @click="openModal('view',order.id)" v-if="order.is_paid">
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
        <Pagination :pagination="pagination" v-show="pagination.total_pages > 1" @paginate="getOrders" />
        <Modal :title="`訂單編號：${order.id}`" ref="viewModal">
                <div class="modal-body">
                    <div class="container">
                        <p class="row">
                            <span class="col-6 col-sm">建立日期</span>
                            <span class="col-6 col-sm">{{ order?.create_at ? $filters.transDate(order.create_at * 1000) : '-' }}</span>
                            <span class="col-6 col-sm">付款日期</span>
                            <span class="col-6 col-sm">{{order?.paid_date ? $filters.transDate(order.paid_date * 1000) : '等待付款中' }}</span>
                        </p>
                        <p class="row">
                            <span class="col-6 col-sm-3">留言</span>
                            <span class="col-6 col-sm">{{ order?.message }}</span>
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
                        <p class="row" v-for="product in products" :key="product.id">
                            <span class="col-12 col-sm-6">{{ product.product.title }}</span>
                            <span class="col-4 col-sm-2 text-end">{{ product.product.price }}</span>
                            <span class="col-4 col-sm-2 text-end">{{ product.qty }}</span>
                            <span class="col-4 col-sm-2 text-end">{{ $filters.currency(product.total) }}</span>
                        </p>
                        <p class="row bitem-top bitem-danger">
                            <template v-if="hasCoupon">
                                <span class="col-6 col-sm-2">總計</span>
                                <span class="col-6 col-sm-2 text-end">{{ $filters.currency(subTotal) }}</span>
                                <span class="col-6 col-sm-2">折扣</span>
                                <span class="col-6 col-sm-2 text-end">{{ $filters.currency(subTotal-finalTotal) }}</span>
                                <span class="col-6 col-sm-2 text-sm-end">優惠價</span>
                                <span class="col-6 col-sm-2 text-end bitem bitem-danger">{{ $filters.currency(finalTotal) }}</span>
                                <br />
                                <span class="text-info text-end">四捨五入至整數位，些微誤差不影響付款</span>
                            </template>
                            <template v-else>
                                <span class="col-9 col-sm-10">合計</span>
                                <span class="col-3 col-sm-2 text-end  bitem bitem-danger">{{ $filters.currency(order?.total) }}</span>
                            </template>
                        </p>
                    </div>
                    <hr />
                    <div class="container">
                        <p class="row">
                            <span class="col-3">地址</span>
                            <span class="col-9 text-end">{{ user.address }}</span>
                        </p>
                        <p class="row">
                            <span class="col-4 col-sm-3">電子信箱</span>
                            <span class="col-8 col-sm-9 text-end">{{ user.email }}</span>
                        </p>
                        <p class="row">
                            <span class="col-6 col-sm-2">姓名</span>
                            <span class="col-6 col-sm-4 text-end">{{ user.name }}</span>
                            <span class="col-6 col-sm">電話</span>
                            <span class="col-6 col-sm text-end">{{ user.tel }}</span>
                        </p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" @click="$refs.viewModal.hideModal()">返回</button>
                </div>
        </Modal>
        <Modal :title="`訂單編號：${order.id}`" ref="payModal">
            <FormC class="modal-content" v-slot="{ errors,values }" @submit="payOrder" @reset="$refs.payModal.hideModal()">
                <div class="modal-body">
                    <div class="row">
                        <div class="col">付款方式</div>
                        <div class="col">
                            <FieldC label="此欄位" name="payMethod" rules="required" class="form-select" v-bind:class="{ 'is-invalid': errors['payMethod'] }" as="select">
                                    <option value="">請選擇</option>
                                    <option value="credit-card">信用卡</option>
                                    <option value="bank-account">銀行帳戶</option>
                                    <option value="mobile-pay">行動支付</option>
                            </FieldC>
                            <ErrorMessage name="payMethod" class="invalid-feedback" />
                        </div>
                    </div>
                    <div v-if="values.payMethod === 'credit-card'">
                        <div class="row mt-1">
                            <div class="col">發卡銀行</div>
                            <div class="col">
                                <FieldC label="此欄位" name="bank" class="form-control" type="text" rules="required" v-bind:class="{ 'is-invalid': errors['bank'] }" />
                                <ErrorMessage name="bank" class="invalid-feedback" />
                            </div>
                        </div>
                        <div class="row mt-1">
                            <div class="col">卡號</div>
                            <div class="col">
                                <FieldC label="此欄位" name="number" class="form-control" type="tel" rules="required|numeric" v-bind:class="{ 'is-invalid': errors['number'] }" />
                                <ErrorMessage name="number" class="invalid-feedback" />
                            </div>
                        </div>
                        <div class="row mt-1">
                            <div class="col">持有人</div>
                            <div class="col">
                                <FieldC label="此欄位" name="owner" class="form-control" type="text" rules="required" v-bind:class="{ 'is-invalid': errors['owner'] }" />
                                <ErrorMessage name="owner" class="invalid-feedback" />
                            </div>
                        </div>
                        <div class="row mt-1">
                            <div class="col">效期</div>
                            <div class="col">
                                <FieldC label="此欄位" name="valid-thru" class="form-control" type="date" rules="required" v-bind:class="{ 'is-invalid': errors['valid-thru'] }" />
                                <ErrorMessage name="valid-thru" class="invalid-feedback" />
                            </div>
                        </div>
                        <div class="row mt-1">
                            <div class="col">檢核碼</div>
                            <div class="col">
                                <FieldC label="此欄位" name="checksum" class="form-control" type="tel" rules="required|numeric" v-bind:class="{ 'is-invalid': errors['checksum'] }" />
                                <ErrorMessage name="checksum" class="invalid-feedback" />
                            </div>
                        </div>
                    </div>
                    <div v-else-if="values.payMethod === 'bank-account'">
                        <div class="row mt-1">
                            <div class="col">開戶總行</div>
                            <div class="col">
                                <FieldC label="此欄位" name="head-office" class="form-control" type="text" rules="required" v-bind:class="{ 'is-invalid': errors['head-office'] }" />
                                <ErrorMessage name="head-office" class="invalid-feedback" />
                            </div>
                        </div>
                        <div class="row mt-1">
                            <div class="col">開戶分行</div>
                            <div class="col">
                                <FieldC label="此欄位" name="branch" class="form-control" type="text" rules="required" v-bind:class="{ 'is-invalid': errors['branch'] }" />
                                <ErrorMessage name="branch" class="invalid-feedback" />
                            </div>
                        </div>
                        <div class="row mt-1">
                            <div class="col">帳號</div>
                            <div class="col">
                                <FieldC label="此欄位" name="account" class="form-control" type="tel" rules="required|numeric" v-bind:class="{ 'is-invalid': errors['account'] }" />
                                <ErrorMessage name="account" class="invalid-feedback" />
                            </div>
                        </div>
                        <div class="row mt-1">
                            <div class="col">戶名</div>
                            <div class="col">
                                <FieldC label="此欄位" name="name" class="form-control" type="text" rules="required" v-bind:class="{ 'is-invalid': errors['name'] }" />
                                <ErrorMessage name="name" class="invalid-feedback" />
                            </div>
                        </div>
                        <div class="row mt-1">
                            <div class="col">一次性密碼</div>
                            <div class="col">
                                <FieldC label="此欄位" name="otp" class="form-control" type="tel" rules="required|numeric" v-bind:class="{ 'is-invalid': errors['otp'] }" />
                                <ErrorMessage name="otp" class="invalid-feedback" />
                            </div>
                        </div>
                    </div>
                    <div v-else-if="values.payMethod === 'mobile-pay'">
                        <div class="row mt-1">
                            <div class="col">支付服務</div>
                            <div class="col">
                                <div class="form-check">
                                    <FieldC label="此欄位" name="service" class="form-check-input" type="radio" rules="required" value="linePay" v-bind:class="{ 'is-invalid': errors['service'] }" />
                                    <label class="form-check-label">Line Pay</label>
                                </div>
                                <div class="form-check">
                                    <FieldC label="此欄位" name="service" class="form-check-input" type="radio" rules="required" value="applePay" v-bind:class="{ 'is-invalid': errors['service'] }" />
                                    <label class="form-check-label">Apple Pay</label>
                                </div>
                                <div class="form-check">
                                    <FieldC label="此欄位" name="service" class="form-check-input" type="radio" rules="required" value="samsungPay" v-bind:class="{ 'is-invalid': errors['service'] }" />
                                    <label class="form-check-label">Samsung Pay</label>
                                </div>
                                <div class="form-check">
                                    <FieldC label="此欄位" name="service" class="form-check-input" type="radio" rules="required" value="googlePay" v-bind:class="{ 'is-invalid': errors['service'] }" />
                                    <label class="form-check-label">Google Pay</label>
                                </div>
                                <div class="form-check">
                                    <FieldC label="此欄位" name="service" class="form-check-input" type="radio" rules="required" value="jkopay" v-bind:class="{ 'is-invalid': errors['service'] }" />
                                    <label class="form-check-label">街口支付</label>
                                </div>
                                <ErrorMessage name="service" class="invalid-feedback" v-bind:class="errors['service']?'d-block':'d-none'"/>
                            </div>
                        </div>
                        <div class="row mt-1">
                            <div class="col">付款代碼</div>
                            <div class="col">
                                <FieldC label="此欄位" name="code" class="form-control" type="tel" rules="required|numeric" v-bind:class="{ 'is-invalid': errors['code'] }" />
                                <ErrorMessage name="code" class="invalid-feedback" />
                            </div>
                        </div>
                        <div class="row mt-1">
                            <div class="col">付款密碼</div>
                            <div class="col">
                                <FieldC label="此欄位" name="password" class="form-control" type="password" rules="required|numeric" v-bind:class="{ 'is-invalid': errors['password'] }" />
                                <ErrorMessage name="password" class="invalid-feedback" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <input type="submit" class="btn btn-primary" value="確定" />
                    <input type="reset" class="btn btn-secondary" value="取消" />
                </div>
            </FormC>
        </Modal>
    </div>
    <h1 class="text-center vh-100" v-else>未送出任何訂單</h1>
</template>
<script>
    import Modal from '@/components/ModalComponent.vue';
    import Pagination from '@/components/PaginationBar.vue';
    export default {
        name: 'OrderView',
        inject: ['emitter'],
        components: {Modal, Pagination},
        methods: {
            getOrder (id) {
                this.isLoading = true;
                this.$http.get(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/order/${id}`
                ).then(response => {
                    if (response.data.success) {
                        this.order = response.data.order;
                        this.user = response.data.order.user;
                    } else {this.emitter.emit('message', {type: 'warning', title: '取得訂單明細失敗', content: response.data.message})}
                }).catch(error => {
                    this.emitter.emit('message', {type: 'danger', title: '取得訂單明細失敗', content: error.response?.data.message});
                }).finally(() => {
                    this.isLoading = false;
                });
            },
            getOrders (page = 1) {
                this.isLoading = true;
                this.$http.get(
                    `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/orders`,
                    {
                        params: {page}
                    }).then(response => {
                        if (response.data.success) {
                            this.orders = response.data.orders;
                            this.pagination = response.data.pagination;
                        } else {this.emitter.emit('message', {type: 'warning', title: '取得訂單列表失敗', content: response.data.message})}
                    }).catch(error => {
                        this.emitter.emit('message', {type: 'danger', title: '取得訂單列表失敗', content: error.response?.data.message});
                    }).finally(() => {
                        this.isLoading = false;
                    });
            },
            openModal (type, orderId) {
                this.order = this.orders.find(order => order.id === orderId) ?? {}
                if (type === 'view') {
                    this.$refs.viewModal.showModal();
                } else if (type === 'pay') {
                    this.$refs.payModal.showModal();
                }
            },
            hide () {
                this.$refs.viewModal.hideModal();
                this.$refs.payModal.hideModal();
            },
            payOrder () {
                this.$http.post(
                    `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/pay/${this.order.id}`,
                    {payMethod: this.payMethod}
                ).then(res => {
                    if (res.data.success) {
                        this.emitter.emit('message', {type: 'success', title: '付款成功', content: res.data.message});
                        this.hideModal();
                    } else {
                        this.emitter.emit('message', {type: 'warning', title: '付款失敗', content: res.data.message});
                    }
                }).catch(err => {
                    this.emitter.emit('message', {type: 'danger', title: '付款失敗', content: err.response?.data.message});
                });
            }
        },
        computed: {
            products () {
                return Object.values(this.order.products || {});
            },
            hasCoupon () {
                return this.products.some(product => product.coupon);
            },
            subTotal () {
                return this.products.reduce((total, product) => total + product.total, 0)
            },
            finalTotal () {
                return this.products.reduce((total, product) => total + product.final_total, 0)
            }
        },
        watch: {
            'order.id' (newOrderId) {
                this.getOrder(newOrderId)
            }
        },
        data () {
            return {
                orders: [],
                order: {},
                user: {},
                pagination: {},
                isLoading: false,
            };
        },
        created () {
            this.getOrders();
        }
    };
</script>