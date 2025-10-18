<template>
  <LoadingC :is-full-page="true" :active="isLoading" />
  <button type="button" class="btn btn-primary float-end" @click="openModal('add')">新增商品</button>
  <table class="table mt-4">
    <thead>
      <tr>
        <th>分類</th>
        <th>產品名稱</th>
        <th class="text-end">原價</th>
        <th class="text-end">售價</th>
        <th class="text-center">是否啟用</th>
        <th>編輯</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="product in products" :key="product.id">
        <td >{{ product.category }}</td>
        <td>{{ product.title }}</td>
        <td class="text-end">{{ currency(product.origin_price) }}</td>
        <td class="text-end">{{ currency(product.price) }}</td>
        <td :class="product.is_enabled === 1 ? 'text-success' : 'text-danger'" class="text-center">
          <span>{{ product.is_enabled === 1 ? '啟' : '停' }}用</span>
        </td>
        <td>
          <div class="btn-group">
            <button @click="openModal('modify',product.id)" class="btn btn-outline-primary btn-sm">編輯</button>
            <button @click="openModal('remove',product.id)" class="btn btn-outline-danger btn-sm">移除</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
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