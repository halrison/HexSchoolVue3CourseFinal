<template>
  <LoadingC :is-full-page="true" :active="isLoading" />
  <button type="button" class="btn btn-primary float-end" @click="openModal('add')">新增優惠券</button>
  <table class="table">
    <thead>
      <tr>
        <th>標題</th>
        <th>代碼</th>
        <th>折扣</th>
        <th>到期日</th>
        <th>啟用</th>
        <th>動作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="coupon in coupons" :key="coupon.id">
        <td>{{ coupon.title }}</td>
        <td>{{ coupon.code }}</td>
        <td>{{ coupon.percent }}</td>
        <td>{{ new Date(coupon.due_date).toLocaleDateString() }}</td>
        <td>{{ coupon.is_enabled ? '已' : '未' }}啟用</td>
        <td>
          <div class="btn-group btn-group-sm">
            <button class="btn btn-outline-primary" @click="openModal('modify', coupon.id)">編輯</button>
            <button class="btn btn-outline-danger" @click="openModal('remove', coupon.id)">移除</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
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