<template>
  <LoadingC :is-full-page="true" :active="isLoading" />
  <div class="container">
    <div class=" row">
      <nav class="col-3 bg-light float-start">
        <div class="position-sticky pt-3">
          <p>分類篩選</p>
          <select class="form-select" v-model="selected">
            <option selected value="">全部</option>
            <option value="favorite">最愛</option>
            <option v-for="category in categories"
                    :key="category" :value="category">{{ category }}</option>
          </select>
        </div>
      </nav>
      <div class="col-9">
        <div class="card-group row">
          <div class="col-4" v-for="product in filterProducts" :key="product.id">
            <ProductCard :product="product" class="mb-3">
              <template v-slot:header>
                <div class="card-header">
                  <router-link class="text-decoration-none" :to="`/product?id=${product.id}`">
                    <h5 class="card-title">{{ product.title }}</h5>
                  </router-link>
                </div>
              </template>
              <template v-slot:body>
                <div class="card-body">
                  <span class="card-text float-start">台幣{{ product.price }}元</span>
                  <span class="card-text float-end">
                    <small class="text-muted">剩餘{{ product.num }}{{ product.unit }}</small>
                  </span>
                </div>
              </template>
            </ProductCard>
          </div>
        </div>
      </div>
    </div>
    <Pagination :pagination="pagination" v-show="pagination.total_pages > 1" @paginate="page=>getProducts(page, 'customer')" />
  </div>
</template>

<script setup>
  import useProductStore from "@/stores/products"
  import useLoadingStore from "@/stores/loading"
  import { storeToRefs } from "pinia"
  import { computed, onMounted, ref } from "vue"
  import ProductCard from "@/components/ProductCard.vue"
  import Pagination from "@/components/PaginationBar.vue"


  const ProductStore = useProductStore()
  const { getProducts } = ProductStore
  const { products, pagination } = storeToRefs(ProductStore)

  const { isLoading } = storeToRefs(useLoadingStore())

  const selected=ref('')
  const filterProducts = computed(()=>{
    switch (selected.value) {
      case '':
        return products.value
      case 'favorite':
        const favorites = JSON.parse(localStorage.getItem('favorite')) || []
        return products.value.filter(product => favorites.includes(product.id))
      default:
        return products.value.filter(product => product.category === selected.value)
    }
  })
  const categories = computed(() => Array.from(new Set(products.value.map(product => product.category))))

  onMounted(async function () {
    await getProducts(1, 'customers')
    selected.value=''
  })
</script>