<template>
    <LoadingC :is-full-page="true" :active="isLoading" />
    <button type="button" class="btn btn-outline-info float-end mt-1" @click="openModal('add')">
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
    <Modal ref="couponModal" :title="modalTitle">
        <template v-slot:body>
            <form id="couponForm" @submit="addEditCoupon" @reset="couponModal.hideModal()">
                <div class="mb-2">
                    <label class="w-100">標題</label>
                    <input type="text" class="form-control" v-model="title" v-bind:class="{ 'is-invalid': errors['title'] }" />
                    <span class="invalid-feedback">{{errorBag.title}}</span>
                </div>
                <div class="mb-2">
                    <label class="w-100">優惠碼</label>
                    <input class="form-control" type="text" v-model="code" v-bind:class="{ 'is-invalid': errors['code'] }" />
                    <span class="invalid-feedback"> {{errorBag.code}}</span>
                </div>
                <div class="row">
                    <div class="col-6 mb-2">
                        <label class="w-100">到期日</label>
                        <input class="form-control" type="date" v-model="due_date" v-bind:class="{ 'is-invalid': errors['due_date'] }" />
                        <span class="invalid-feedback">{{errorBag.due_date}}</span>
                    </div>
                    <div class="col-3 mb-2">
                        <label class="w-100">折扣</label>
                        <input class="form-control" type="number" v-model="percent" v-bind:class="{ 'is-invalid': errors['percent'] }" />
                        <span class="invalid-feedback">{{errorBag.percent}}</span>
                    </div>
                    <div class="col-3 mb-2">
                        <label class="w-100">啟用</label>
                        <input name="enabled" class="form-check-input" type="checkbox"
                               v-bind:checked="is_enabled.checked" :value="is_enabled.value.value" />
                    </div>
                </div>
            </form>
        </template>
        <template v-slot:footer>
            <input form="couponForm" type="submit" class="btn btn-primary" value="確定" />
            <input form="couponForm" type="reset" class="btn btn-secondary" value="取消" />
        </template>
    </Modal>
    <Modal ref="removeModal" title="刪除優惠券">
        <template v-slot:body>
            <p>{{modalTitle}}</p>
        </template>
        <template v-slot:footer>
            <button type="button" class="btn btn-secondary" @click="removeModal.hideModal()">取消</button>
            <button type="button" class="btn btn-danger" @click="removeCoupon">確定</button>
        </template>
    </Modal>
</template>
<script setup>
    import {getCurrentInstance, inject, onMounted, reactive, ref, useTemplateRef} from 'vue'
    import {useField,useForm} from 'vee-validate'
    import useLoadingStore from '@/stores/loading'
    import useMessageStore from '@/stores/messages'
    import Modal from '@/components/ModalComponent.vue'
    import Pagination from '@/components/PaginationBar.vue'
    const http = inject('http')
    const coupon = reactive({})
    const coupons = reactive([])
    const pagination = reactive({})
    const modalTitle = ref('')
    const couponModal = useTemplateRef('couponModal')
    const removeModal = useTemplateRef('removeModal')
    const {proxy} = getCurrentInstance()
    const {defineField, errorBag, errors, handleSubmit, resetForm, setValues} = useForm({
        initialValues: {
            title: '',
            code: '',
            due_date: proxy.$filters.transDate(Date.now()),
            percent: 0,
        },
        initialErrors: {
            title: '',
            code: '',
            due_date: '',
            percent: ''
        },
        validationSchema: {
            title: 'required',
            code: 'required',
            due_date: function (value) {
                if (!value) return '此欄位為必填'
                else if (!coupon.id && proxy.$filters.transDate(value) < proxy.$filters.transDate(Date.now())) return '不得比今天還早'
                else return true
            },
            percent: 'required|integer|min_value:1|max_value:99'
        }
    })
    const is_enabled = useField(
        'is_enabled',
        undefined,
        {
            type: 'checkbox',
            syncVModel: true,
            checkedValue: 1,
            uncheckedValue: 0
        }
    )
    const [title] = defineField('title', {label: '此欄位'})
    const [code] = defineField('code', {label: '此欄位'})
    const [due_date] = defineField('due_date')
    const [percent] = defineField('percent', {label: '此欄位'})
    const isLoading = useLoadingStore()
    const messageStore = useMessageStore()
    const addEditCoupon = handleSubmit(tempCoupon => {
        const type = coupon.id ? 'put' : 'post'
        const api = coupon.id ? `/api/${import.meta.env.VITE_PATH}/admin/coupon/${coupon.id}` : `/api/${import.meta.env.VITE_PATH}/admin/coupon`
        http({
            url: api,
            method: type,
            data: {
                data: {
                    ...tempCoupon,
                    is_enabled: is_enabled.value.value,
                    due_date: new Date(tempCoupon.due_date).getTime()
                }
            }
        }).then(res => {
            if (res.data.success) {
                couponModal.value.hideModal()
                messageStore.pushMessage({
                    title: `${type === 'put' ? '變更' : '新增'}優惠券成功`,
                    content: res.data.message,
                    type: 'success'
                })
                getCoupons(1)
            } else {
                messageStore.pushMessage({
                    title: `${type === 'put' ? '變更' : '新增'}優惠券失敗`,
                    content: res.data.message,
                    type: 'warning'
                })
            }
        }).catch(err => {
            err.response?.data.message.forEach(msg => {
                messageStore.pushMessage({
                    title: `${type === 'put' ? '變更' : '新增'}優惠券發生錯誤`,
                    content: msg,
                    type: 'danger'
                })
            })
        })
    })
    const getCoupons = page=> {
        isLoading.value = true
        coupons.length = 0
        http({
            url: `/api/${import.meta.env.VITE_PATH}/admin/coupons`,
            params: {page}
        }).then(({data}) => {
            if (data.success) {
                coupons.push(...data.coupons)
                Object.assign(pagination, data.pagination)
            } else {
                messageStore.pushMessage({
                    title: '取得優惠券列表失敗',
                    message: data.message,
                    type: 'danger'
                })
            }
        }).catch(err => {
            messageStore.pushMessage({
                title: '取得優惠券列表發生錯誤',
                message: err.response?.data.message,
                type: 'danger'
            })
        }).finally(() => {
            isLoading.value = false
        })
    }
    const openModal = (action, item) => {
        if (action === 'add') {
            modalTitle.value = '新增優惠券'
            resetForm()
            couponModal.value.showModal()
        } else if (action === 'modify') {
            Object.assign(coupon, item)
            modalTitle.value = '編輯優惠券'
            setValues({
                ...item,
                due_date: proxy.$filters.transDate(item.due_date)
            })
            couponModal.value.showModal()
        } else if (action === 'remove') {
            Object.assign(coupon, item)
            modalTitle.value = `要刪除優惠券 ${coupon.title} 嗎？`
            removeModal.value.showModal()
        }
    }
    const removeCoupon = () => {
        http({
            url: `/api/${process.env.VUE_APP_PATH}/admin/coupon/${coupon.id}`,
            method: 'delete'
        }).then(({data}) => {
            if (data.success) {
                removeModal.value.hideModal()
                messageStore.pushMessage({
                    title: '移除成功',
                    message: data.message,
                    type: 'success'
                })
                getCoupons()
            } else {
                messageStore.pushMessage({
                    title: '移除失敗',
                    message: data.message,
                    type: 'warning'
                })
            }
        }).catch(err => {
            messageStore.pushMessage({
                title: '移除發生錯誤',
                message: err.response?.data.message,
                type: 'danger'
            })
        })
    }
    onMounted(() => {
        getCoupons(1)
    })
</script>