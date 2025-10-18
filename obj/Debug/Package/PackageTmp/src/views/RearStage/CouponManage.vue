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
          <td class="col-sm-3 col-lg-3">{{ new Date(coupon.due_date).toLocaleDateString() }}</td>
          <td class="col-sm-3 col-lg-1 text-lg-end">{{ coupon.percent }}</td>          
          <td class="col-sm-3 col-lg-1" 
            v-bind:class="coupon.is_enabled === 1 ? 'text-success' : 'text-danger'">
            {{ coupon.is_enabled ? '啟' : '停' }}用
          </td>
          <td class="col-sm-3 col-lg-2">
            <div class="btn-group btn-group-sm">
              <button @click="openModal('modify',coupon.id)" class="btn btn-outline-primary">
                <i class="bi bi-pencil-square"></i>
                <span class="d-none d-lg-inline-block">編輯</span>
              </button>
              <button @click="openModal('remove',coupon.id)" class="btn btn-outline-danger">
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
    @paginate="page => CouponStore.getCoupon(page, 'admin')" />
  <CouponModal ref="addEditModal" :coupon="coupon" />
  <RemoveModal ref="removeModal" :item="coupon" type="優惠券" />
</template>

<script setup>
  import { computed, onMounted, ref } from "vue"
  import { storeToRefs } from "pinia"
  import useCouponStore from "@/stores/coupons"
  import useLoadingStore from "@/stores/loading"
  import Pagination from "@/components/PaginationBar.vue"
  import CouponModal from "@/components/CouponModal.vue"
  import RemoveModal from "@/components/RemoveModal.vue"

  const CouponStore = useCouponStore()

  const { isLoading } = storeToRefs(useLoadingStore())

  const coupon = ref({})
  const addEditModal = ref(null)
  const removeModal = ref(null)
  const coupons = computed(() => CouponStore.coupons)
  const pagination = computed(() => CouponStore.pagination)

  onMounted(async function () {
    await CouponStore.getCoupons(1)
  })

  function openModal (action, id = '') {
    coupon.value = {}
    switch (action) {
      case 'add':
        coupon.value = { due_date: new Date().toISOString().split('T')[0] }
        addEditModal.value.show()
        break
      case 'modify':
        coupon.value = coupons.value.find(coupon => coupon.id === id)
        coupon.value.due_date = new Date(coupon.value.due_date).toISOString().split('T')[0]
        addEditModal.value.show()
        break
      case 'remove':
        coupon.value = coupons.value.find(coupon => coupon.id === id)
        removeModal.value.show()
    }
  }
</script>