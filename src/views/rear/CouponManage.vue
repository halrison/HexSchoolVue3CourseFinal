<template>
    <LoadingC :is-full-page="true" :active="isLoading" />
    <button type="button" class="btn btn-outline-info float-end mt-1" @click="openModal('add',{})">
        <i class="bi bi-plus"></i>
        新增優惠券
    </button>
    <div class="table-responsive-sm overflow-x-hidden mt-5">
        <table class="table table-striped">
            <thead>
                <tr class="row mx-0">
                    <th class="col-6 col-lg-2">標題</th>
                    <th class="col-6 col-lg-3">代碼</th>
                    <th class="col-6 col-lg-3">到期日</th>
                    <th class="col-3 col-lg-1">狀態</th>
                    <th class="col-3 col-lg-1 text-lg-end">折扣</th>
                    <th class="col-lg-2">動作</th>
                </tr>
            </thead>
            <tbody>
                <tr class="row mx-0" v-for="coupon in coupons" :key="coupon.id">
                    <td class="col-6 col-lg-2">{{ coupon.title }}</td>
                    <td class="col-6 col-lg-3">{{ coupon.code }}</td>
                    <td class="col-6 col-lg-3">{{ $filters.transDate(coupon.due_date) }}</td>
                    <td class="col-3 col-lg-1"
                        v-bind:class="coupon.is_enabled === 1 ? 'text-success' : 'text-danger'">
                        {{ coupon.is_enabled ? '啟' : '停' }}用
                    </td>
                    <td class="col-3 col-lg-1 text-lg-end">{{ coupon.percent }}</td>
                    <td class="col-lg-2">
                        <div class="btn-group btn-group-sm w-100">
                            <button @click.prevent="openModal('modify',coupon)" class="btn btn-outline-warning">
                                <i class="bi bi-pencil-square"></i>
                                編輯
                            </button>
                            <button @click.prevent="openModal('remove',coupon)" class="btn btn-outline-danger">
                                <i class="bi bi-trash"></i>
                                移除
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <Pagination :pagination="pagination" v-show="pagination.total_pages > 1" @paginate=" getCoupons" />
    <Modal size="md" :title="modalTitle" ref="AddEditModal">
        <FormC class="modal-content" v-slot="{ errors }" @submit="addEditCoupon" @reset="$refs.AddEditModal.hideModal()" :initial-values="coupon" :initial-errors="error">
            <div class="modal-header">
                <h5 class="modal-title">
                    <span>{{ coupon.id ? '編輯' : '新增' }}優惠券</span>
                </h5>
            </div>
            <div class="modal-body">
                <div class="mb-2">
                    <label class="w-100">標題</label>
                    <FieldC label="標題" name="title" class="form-control" type="text" as="input"
                            v-model="tempCoupon.title" v-bind:class="{ 'is-invalid': errors['title'] }" />
                    <ErrorMessage name="title" class="invalid-feedback" />
                </div>
                <div class="mb-2">
                    <label class="w-100">優惠碼</label>
                    <FieldC label="優惠碼" name="code" class="form-control" type="text" as="input"
                            v-bind:class="{ 'is-invalid': errors['code'] }" />
                    <ErrorMessage name="code" class="invalid-feedback" />
                </div>
                <div class="row">
                    <div class="col-6 mb-2">
                        <label class="w-100">到期日</label>
                        <FieldC label="到期日" name="date" class="form-control" type="date" as="input"
                                v-bind:class="{ 'is-invalid': errors['date'] }" />
                        <ErrorMessage name="date" class="invalid-feedback" />
                    </div>
                    <div class="col-3 mb-2">
                        <label class="w-100">折扣</label>
                        <FieldC label="折扣" name="discount" class="form-control" type="number" as="input"
                                v-bind:class="{ 'is-invalid': errors['discount'] }" />
                        <ErrorMessage name="discount" class="invalid-feedback" />
                    </div>
                    <div class="col-3 mb-2">
                        <label class="w-100">啟用</label>
                        <FieldC name="is_enabled" class="form-check-input" type="checkbox" as="input"
                                :true-value="1" :false-value="0" />
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="submit" class="btn btn-primary">確定</button>
                <button type="reset" class="btn btn-danger">取消</button>
            </div>
        </FormC>
    </Modal>
    <Modal size="sm" ref="RemoveModal">
        <div class="modal-header">
            <h5 class="modal-title">刪除優惠券</h5>
        </div>
        <div class="modal-body">
            <p>您要刪除{{coupon.title}}嗎？</p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="$refs.RemoveModal.hideModal()">取消</button>
            <button type="button" class="btn btn-danger" @click="removeCoupon(coupon.id)">確認</button>
        </div>
    </Modal>
</template>
<script>
    import Modal from '@/components/ModalComponent.vue'
    import Pagination from '@/components/PaginationBar.vue'
    export default {
        name: 'CouponManage',
        inject: ['emitter'],
        components: {Modal, Pagination},
        methods: {
            addEditCoupon (tempCoupon) {
                this.coupon = {
                    ...tempCoupon,
                    due_date: new Date(tempCoupon.due_date).getTime()
                }
                const type = this.coupon.id ? 'put' : 'post'
                const api = this.coupon.id ? `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/coupon/${this.coupon.id}` : `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/coupon`
                this.$http[type](
                    api,
                    {data: this.coupon}
                ).then(({data}) => {
                    if (data.success) {
                        this.emitter.emit(
                            'message',
                            {
                                title: `${type === 'put' ? '變更' : '新增'}優惠券成功`,
                                content: data.message,
                                type: 'success'
                            }
                        )
                        this.$refs.AddEditModal.hideModal()
                    } else {
                        this.emitter.emit(
                            'message',
                            {
                                title: `${type === 'put' ? '變更' : '新增'}優惠券失敗`,
                                content: data.message,
                                type: 'warning'
                            }
                        )
                    }
                }).catch(err => {
                    err.response.data.message.forEach(msg => {
                        this.emitter.emit(
                            'message',
                            {
                                title: `${type === 'put' ? '變更' : '新增'}優惠券發生錯誤`,
                                content: msg,
                                type: 'danger'
                            }
                        )
                    })
                }).finally(() => {
                    this.getCoupons()
                })
            },
            getCoupons (page = 1) {
                this.isLoading = true
                this.$http.get(
                    `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/coupons`,
                    {
                        params: {page}
                    }).then(({data}) => {
                        if (data.success) {
                            this.coupons = data.coupons
                            this.pagination = data.pagination
                        } else {
                            this.emitter.emit(
                                'message',
                                {
                                    title: '取得優惠券列表失敗',
                                    message: data.message,
                                    type: 'danger'
                                }
                            )
                        }
                    }).catch(err => {
                        this.emitter.emit(
                            'message',
                            {
                                title: '取得優惠券列表發生錯誤',
                                message: err.response.data.message,
                                type: 'danger'
                            }
                        )
                    }).finally(() => {
                        this.isLoading = false
                    })
            },
            openModal (action, item) {
                this.coupon = item
                if (action === 'add') {
                    this.coupon.due_date = this.$filters.transDate(Date.now())
                    this.$refs.AddEditModal.showModal()
                } else if (action === 'modify') {
                    this.coupon.due_date = this.$filters.transDate(item.due_date())
                    this.$refs.AddEditModal.showModal()
                } else if (action === 'remove') {
                    this.$refs.RemoveModal.showModal()
                }
            },
            removeCoupon (id) {
                this.$http.delete(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/coupon/${id}`)
                    .then(({data}) => {
                        if (data.success) {
                            this.emitter?.emit(
                                'message',
                                {
                                    title: '移除優惠券成功',
                                    message: data.message,
                                    type: 'success'
                                }
                            )
                            this.$refs.RemoveModal.hideModal()
                        } else {
                            this.emitter?.emit(
                                'message',
                                {
                                    title: '移除優惠券失敗',
                                    message: data.message,
                                    type: 'warning'
                                }
                            )
                        }
                    }).catch(err => {
                        this.emitter?.emit(
                            'message',
                            {
                                title: '移除優惠券發生錯誤',
                                message: err.response?.data.message,
                                type: 'danger'
                            }
                        )
                    })
            }
        },
        data () {
            return {
                coupons: [],
                coupon: {},
                pagination: {},
                isLoading: false
            }
        },
        computed: {
            schema(){
                return{
                    title: 'required',
                    percent: 'required|integer|min:1|max:99',
                    code: 'required',
                    due_date(value) {
                        if (!value) return '此欄位為必填'
                        else if (!this.coupon.id && this.$filters.transDate(value) < this.$filters.transDate(Date.now())) return '不得比今天還早'
                        else return true
                    }
                }
            }
        },
        created () {
            this.getCoupons()
        }
    }
</script>