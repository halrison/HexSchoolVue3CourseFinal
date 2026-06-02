<template>
    <div class="modal fade" tabindex="-1" ref="DOM">
        <div class="modal-dialog" role="dialog">
            <FormC class="modal-content" v-slot="{ errors }" @submit="$emit('add-edit',tempCoupon)" @reset="hideModal" :initial-values="coupon" :initial-errors="error">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <span>{{ coupon.id ? '編輯' : '新增' }}優惠券</span>
                    </h5>
                </div>
                <div class="modal-body">
                    <div class="mb-2">
                        <label class="w-100">標題</label>
                        <FieldC label="標題" name="title" class="form-control" type="text" rules="required"
                                v-model="tempCoupon.title" v-bind:class="{ 'is-invalid': errors['title'] }" />
                        <ErrorMessage name="title" class="invalid-feedback" />
                    </div>
                    <div class="mb-2">
                        <label class="w-100">優惠碼</label>
                        <FieldC label="優惠碼" name="code" class="form-control" type="text" rules="required"
                                v-model="tempCoupon.code" v-bind:class="{ 'is-invalid': errors['code'] }" />
                        <ErrorMessage name="code" class="invalid-feedback" />
                    </div>
                    <div class="row">                        
                        <div class="col-6 mb-2">
                            <label class="w-100">到期日</label>
                            <FieldC label="到期日" name="date" class="form-control" type="date" rules="required"
                                    v-model="tempCoupon.due_date" v-bind:class="{ 'is-invalid': errors['date'] }" />
                            <ErrorMessage name="date" class="invalid-feedback" />
                        </div>
                        <div class="col-3 mb-2">
                            <label class="w-100">折扣</label>
                            <FieldC label="折扣" name="discount" class="form-control" type="number" rules="required|integer" min="1" max="99"
                                    v-model="tempCoupon.percent" v-bind:class="{ 'is-invalid': errors['discount'] }" />
                            <ErrorMessage name="discount" class="invalid-feedback" />
                        </div>
                        <div class="col-3 mb-2">
                            <label class="w-100">啟用</label>
                            <input name="enabled" class="form-check-input" type="checkbox"
                                   v-model="tempCoupon.is_enabled" :true-value="1" :false-value="0" />
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary">確定</button>
                    <button type="reset" class="btn btn-danger">取消</button>
                </div>
            </FormC>
        </div>
    </div>
</template>
<script>
    import modal from "@/mixins/modal";
    export default {
        name: "CouponModal",
        mixins: [modal],
        props: {
            coupon: {
                type: Object,
                default: () => ({
                    title: '',
                    code: '',
                    percent: 0,
                    due_date: '',
                    is_enabled: 0
                })
            }
        },
        watch: {
            coupon (newValue) {
                this.tempCoupon = {
                    ...newValue,
                    due_date: this.$filters.transDate(newValue.due_date || Date.now())
                }
                this.error = {}
            }
        },
        data () {
            return {
                tempCoupon: {due_date: this.$filters.transDate(Date.now())},
                error: {}
            }
        }
    }
</script>