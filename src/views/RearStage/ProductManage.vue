<template>
  <LoadingC :is-full-page="true" :active="isLoading" />
  <button type="button" class="btn btn-primary float-end mt-1" @click="openModal('add')">新增商品</button>
  <div class="table-responsive-sm overflow-x-hidden mt-5">
    <table class="table table-striped">
      <thead class="sticky-top">
        <tr class="row mx-0">
          <th class="col-sm-3 col-lg-2">分類</th>
          <th class="col-sm-9 col-lg-3">產品名稱</th>
          <th class="col-sm-3 col-lg-2 text-lg-end">原價</th>
          <th class="col-sm-3 col-lg-2 text-lg-end">售價</th>
          <th class="col-sm-3 col-lg-1 text-lg-center">狀態</th>
          <th class="col-sm-3 col-lg-2">動作</th>
        </tr>
      </thead>
      <tbody>
        <tr class="row mx-0" v-for="product in products" :key="product.id">
          <td class="col-sm-3 col-lg-2">{{ product.category }}</td>
          <td class="col-sm-9 col-lg-3">{{ product.title }}</td>
          <td class="col-sm-3 col-lg-2 text-lg-end">{{ currency(product.origin_price) }}</td>
          <td class="col-sm-3 col-lg-2 text-lg-end">{{ currency(product.price) }}</td>
          <td class="col-sm-3 col-lg-1 text-lg-center"
            v-bind:class="product.is_enabled === 1 ? 'text-success' : 'text-danger'">
            {{ product.is_enabled === 1 ? '啟' : '停' }}用
          </td>
          <td class="col-sm-3 col-lg-2">
            <div class="btn-group btn-group-sm">
              <button @click="openModal('modify',product.id)" class="btn btn-outline-primary">
                <i class="bi bi-pencil-square"></i>
                <span class="d-none d-xl-inline-block">編輯</span>
              </button>
              <button @click="openModal('remove',product.id)" class="btn btn-outline-danger">
                <i class="bi bi-trash"></i>
                <span class="d-none d-xl-inline-block">移除</span>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <Pagination :pagination="pagination" v-show="pagination.total_pages > 1" @paginate="page => ProductStore.getProducts(page, 'admin')" />
  <ProductModal :product="product" ref="addEditModal" />
  <RemoveModal :item="product" type="產品" ref="removeModal" />
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { currency } from "@/util"
  import useProductStore from '@/stores/products'
  import useLoadingStore from "@/stores/loading"
  import Pagination from "@/components/PaginationBar.vue"
  import ProductModal from '@/components/ProductModal.vue'
  import RemoveModal from '@/components/RemoveModal.vue'

  const { isLoading } = storeToRefs(useLoadingStore())

  const ProductStore = useProductStore()

  const products = computed(() => ProductStore.products)
  const pagination = computed(() => ProductStore.pagination)
  const product = ref({})
  const addEditModal = ref(null)
  const removeModal = ref(null)

  onMounted(async function () {
    await ProductStore.getProducts(1, 'admin')
  })

  async function openModal (action, id = '') {
    product.value = products.value.find(product => product.id === id) || {}
    switch (action) {
      case 'add':
        addEditModal.value.show()
        break
      case 'modify':
        addEditModal.value.show()
        break
      case 'remove':
        removeModal.value.show()
        break
    }
  }
</script>

<style>
@media screen and (768px < width){
  .text-lg-center{
    text-align: center;
  }
  .text-lg-end{
    text-align: right;
  }
}
</style>