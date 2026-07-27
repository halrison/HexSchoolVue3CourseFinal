<template>
    <LoadingC :is-full-page="true" :active="isLoading" />
    <div class="container">
        <div class="row">
            <nav class="col-sm-3 bg-light float-start">
                <div class="position-sticky pt-3 h-100">
                    <p>分類篩選</p>
                    <select class="form-select" v-model="selected">
                        <option selected value="">全部</option>
                        <option value="favorite">最愛</option>
                        <option v-for="category in categories"
                                :key="category" :value="category">
                            {{ category }}
                        </option>
                    </select>
                </div>
            </nav>
            <div class="col-sm-9 mt-1">
                <div class="card-group row">
                    <div class="col-12 col-md-6 col-lg-4" v-for="product in filterProducts" :key="product.id">
                        <ProductCard :product="product" class="mb-3">
                            <template #header>
                                <div class="card-header">
                                    <router-link :to="`/product?id=${product.id}`" class="text-decoration-none">
                                        <h6 class="text-center">{{ product.title }}</h6>
                                    </router-link>
                                </div>
                            </template>
                            <template #body>
                                <div class="card-body">
                                    <div class="card-text" v-if="product.origin_price === product.price">
                                        <div class="text-center">台幣{{ product.price }}元</div>
                                    </div>
                                    <div class="card-text" v-else>
                                        <span class="float-start">原價{{product.origin_price}}元</span>
                                        <span class="float-end">特價{{product.price}}元</span>
                                    </div>
                                </div>
                            </template>
                            <template #footer>
                                <div class="card-footer">
                                    <div class="text-center">剩餘{{ product.num }}{{ product.unit }}</div>
                                </div>
                            </template>
                        </ProductCard>
                    </div>
                </div>
            </div>
        </div>
        <Pagination :pagination="productStore.pagination" v-show="productStore.pagination.total_pages > 1" @paginate="productStore.getProducts" />
    </div>
</template>
<script setup>
    import {computed, inject, onMounted, reactive, ref} from "vue"
    import useProductStore from "@/stores/products"
    import useLoadingStore from "@/stores/loading"
    import Pagination from '@/components/PaginationBar.vue'
    import ProductCard from '@/components/ProductCard.vue'
    const isLoading = useLoadingStore()
    const productStore = useProductStore()
    const http = inject('http')
    const selected = ref('')
    const filterProducts = computed(function () {
        if (selected.value === '') return productStore.products
        else if (selected.value === 'favorite') return productStore.products.filter(product => product.is_favorite)
        else return productStore.products.filter(product => product.category === selected.value)
    })
    const categories = computed(() => [...new Set(productStore.products.map(product => product.category))])
    onMounted(() => {
        productStore.getProducts(1, 'customer')
    })
</script>