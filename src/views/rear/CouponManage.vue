<template>
  <LoadingC :is-full-page="true" :active="isLoading" />
  <button type="button" class="btn btn-primary float-end mt-1" @click="openModal('add')">新增優惠券</button>
  <div class="table-responsive-sm overflow-x-hidden mt-5">
    <table class="table table-striped">
      <thead class="sticky-top">
        <tr class="row mx-0">
          <th class="col-sm-6 col-lg-2">標題</th>
          <th class="col-sm-6 col-lg-3">代碼</th>
          <th class="col-sm-3 col-lg-3">到期日</th>
          <th class="col-sm-3 col-lg-1 text-lg-end">折扣</th>
          <th class="col-sm-3 col-lg-1">狀態</th>
          <th class="col-sm-3 col-lg-2">動作</th>
        </tr>
      </thead>
      <tbody>
        <tr class="row mx-0" v-for="coupon in coupons" :key="coupon.id">
          <td class="col-sm-6 col-lg-2">{{ coupon.title }}</td>
          <td class="col-sm-6 col-lg-3">{{ coupon.code }}</td>
          <td class="col-sm-3 col-lg-3">{{ $filters.transDate(coupon.due_date) }}</td>
          <td class="col-sm-3 col-lg-1 text-lg-end">{{ coupon.percent }}</td>
          <td class="col-sm-3 col-lg-1"
              v-bind:class="coupon.is_enabled === 1 ? 'text-success' : 'text-danger'">
            {{ coupon.is_enabled ? '啟' : '停' }}用
          </td>
          <td class="col-sm-3 col-lg-2">
            <div class="btn-group btn-group-sm">
              <button @click.prevent="openModal('modify',coupon)" class="btn btn-outline-primary">
                <i class="bi bi-pencil-square"></i>
                <span class="d-none d-lg-inline-block">編輯</span>
              </button>
              <button @click.prevent="openModal('remove',coupon)" class="btn btn-outline-danger">
                <i class="bi bi-trash"></i>
                <span class="d-none d-lg-inline-block">移除</span>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <Pagination :pagination="pagination" v-show="pagination.total_pages > 1"
              @paginate=" getCoupons" />
  <CouponModal ref="addEditModal" :coupon="coupon" @add-edit="addEditCoupon" />
  <RemoveModal ref="removeModal" :item="coupon" type="優惠券" @remove="getCoupons" />
</template>
<script>
  import CouponModal from '@/components/CouponModal.vue'
  import RemoveModal from '@/components/RemoveModal.vue'
  import Pagination from '@/components/PaginationBar.vue'
  export default {
    name: 'CouponManage',
    inject: [ 'emitter' ],
    components: { CouponModal, RemoveModal, Pagination },
    methods: {
      addEditCoupon ( tempCoupon ) {
        this.coupon = {
          ...tempCoupon,
          due_date: new Date( tempCoupon.due_date ).getTime()
        }
        const type = this.coupon.id ? 'put' : 'post'
        const api = this.coupon.id ? `${ process.env.VUE_APP_API }/api/${ process.env.VUE_APP_PATH }/admin/coupon/${ this.coupon.id }` : `${ process.env.VUE_APP_API }/api/${ process.env.VUE_APP_PATH }/admin/coupon`
        this.$http[ type ](
          api,
          { data: this.coupon }
        ).then( ( { data } ) => {
          if ( data.success ) {
            this.emitter.emit( 'message', { title: `${ type === 'put' ? '變更' : '新增' }優惠券成功`, content: data.message, type: 'success' } )
            this.$refs.addEditModal.hideModal()
          } else {
            this.emitter.emit( 'message', { title: `${ type === 'put' ? '變更' : '新增' }優惠券失敗`, content: data.message, type: 'warning' } )
          }
        } ).catch( err => {
          err.response.data.message.forEach( msg => {
            this.emitter.emit( 'message', { title: `${ type === 'put' ? '變更' : '新增' }優惠券發生錯誤`, content: msg, type: 'danger' } )
          } )
        } ).finally( () => {
          this.getCoupons()
        } )
      },
      getCoupons ( page = 1 ) {
        this.isLoading = true
        this.$http.get(
          `${ process.env.VUE_APP_API }/api/${ process.env.VUE_APP_PATH }/admin/coupons`,
          {
            params: { page }
          } ).then( ( { data } ) => {
            if ( data.success ) {
              this.coupons = data.coupons
              this.pagination = data.pagination
            } else {
              this.emitter.emit( 'message', { title: '取得優惠券列表失敗', message: data.message, type: 'danger' } )
            }
          } ).catch( err => {
            this.emitter.emit( 'message', { title: '取得優惠券列表發生錯誤', message: err.response.data.message, type: 'danger' } )
          } ).finally( () => {
            this.isLoading = false
          } )
      },
      openModal ( action, item ) {
        if ( action === 'add' ) {
          this.coupon = {}
          this.$refs.addEditModal.showModal()
        } else if ( action === 'modify' ) {
          this.coupon = { ...item }
          this.$refs.addEditModal.showModal()
        } else if ( action === 'remove' ) {
          this.coupon = { ...item }
          this.$refs.removeModal.showModal()
        }
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
    created () {
      this.getCoupons()
    }
  }
</script>