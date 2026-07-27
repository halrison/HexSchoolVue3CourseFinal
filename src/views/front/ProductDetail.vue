<template>
    <LoadingC :active="isLoading" :is-full-page="true" />
    <div class="container mt-1">
        <div class="row justify-content-center">
            <figure class="col figure">
                <Carousel :items="productStore.product.imagesUrl ? [ productStore.product.imageUrl, ...productStore.product.imagesUrl ] : [ productStore.product.imageUrl ]" v-slot="{ items }">
                    <div class="ratio ratio-1x1 carousel-item" v-for="image, index in items" v-bind:class="{ 'active': index === 0 }" :key="index">
                        <img class="d-block img-fluid" :src="image" />
                    </div>
                </Carousel>
            </figure>
            <div class="col">
                <nav class="row mt-1" aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item">所有商品</li>
                        <li class="breadcrumb-item active" aria-current="page">{{ productStore.product.category }}</li>
                    </ol>
                </nav>
                <h2 class="fw-bold mb-1">{{ productStore.product.title }}</h2>
                <div class="row">
                    <div class="col-md-6">
                        <template v-if="productStore.product.origin_price">
                            <p class="mb-0 text-muted text-end">
                                原價<del>{{ productStore.product.origin_price }}</del> 元
                            </p>
                            <h4 class="fw-bold text-end">現在只要 {{ productStore.product.price }} 元</h4>
                        </template>
                        <h4 v-else>{{ productStore.product.price }} 元</h4>
                    </div>
                    <div class="col-md-6">
                        <button class="btn btn-secondary input-group-prepend w-100 py-2" v-if="isFavorite" @click="favorite">
                            <i class="bi bi-heart me-1"></i>移除最愛
                        </button>
                        <button class="btn btn-outline-secondary input-group-prepend w-100 py-2" v-else @click="favorite">
                            <i class="bi bi-heart-fill me-1"></i>加入最愛
                        </button>
                    </div>
                </div>
                <div class="row align-items-center">
                    <div class="col-md-6">
                        <div class="input-group my-3 bg-light rounded">
                            <div class="input-group-prepend">
                                <button class="btn btn-outline-dark border-0 py-2" type="button" @click="quantity--">
                                    <i class="bi bi-dash"></i>
                                </button>
                            </div>
                            <input type="text" class="form-control border-0 text-center my-auto shadow-none bg-light"
                                   aria-label="Example text with button addon" aria-describedby="button-addon1" :value="quantity" />
                            <div class="input-group-append">
                                <button class="btn btn-outline-dark border-0 py-2" type="button" @click="quantity++">
                                    <i class="bi-plus bi"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <button type="button" class="text-nowrap btn btn-dark w-100 py-2" @click="addToCart">
                            <i class="bi bi-cart-plus me-1"></i>加到購物車
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="row my-5">
            <div class="col border-end">
                <h3 class="text-center">商品描述</h3>
                <p>{{ productStore.product.description }}</p>
            </div>
            <div class="col">
                <h3 class="text-center">商品說明</h3>
                <p>{{ productStore.product.content }}</p>
            </div>
        </div>
        <h3 class="text-center">更多商品</h3>
        <Swiper class="mb-1" :products="filterProducts" />
    </div>
</template>
<script setup>
    import {computed, inject, onBeforeMount, onMounted, ref} from 'vue'
    import {useRoute} from 'vue-router'
    import useLoadingStore from '@/stores/loading'
    import useProductStore from '@/stores/products'
    import useCartStore from '@/stores/carts'
    import Carousel from '@/components/CarouselComponent.vue'
    import Swiper from '@/components/SwiperComponent.vue'
    const route = useRoute()
    const isLoading = useLoadingStore()
    const productStore = useProductStore()
    const filterProducts = computed(() => productStore.products.filter(product => product.id !== route.query.id))
    const http = inject('http')
    const messageStore = inject('message')
    const isFavorite = ref(false)
    const quantity = ref(1)
    const addToCart = () => {
        http({
            url: `/api/${import.meta.env.VITE_PATH}/cart`,
            method: 'post',
            data: {
                data: {
                    product_id: route.query.id,
                    qty: quantity.value
                }
            }
        }).then(res => {
            if (res.data.success) {
                messageStore.pushMessage({
                    type: 'success', 
                    title: '加入購物車成功',
                    content: res.data.message
                })
                useCartStore().getCarts()
            } else {
                messageStore.pushMessage({
                    type: 'warning',
                    title: '加入購物車失敗',
                    content: res.data.message
                });
            }
        }).catch(err => {
            messageStore.pushMessage({
                type: 'danger', 
                title: '加入購物車發生錯誤', 
                content: err.response?.data.message
            });
        })
    }
    const favorite = () => {
        isFavorite.value = !isFavorite.value;
        let favoriteList = localStorage.getItem('favorite') ? JSON.parse(localStorage.getItem('favorite')) : []
        if (favoriteList.includes(productStore.product.id)) {
            favoriteList = favoriteList.filter(f => f !== productStore.product.id)
            messageStore.pushMessage({
                type: 'success',
                title: '移除最愛成功', 
                content: `已將${productStore.product.title}移除最愛`})
        } else {
            favoriteList = favoriteList.concat(productStore.product.id)
            messageStore.pushMessage({
                type: 'success',
                title: '加入最愛成功', 
                content: `已將${productStore.product.title}加入最愛`
            })
        }
        localStorage.setItem('favorite', JSON.stringify(favoriteList))
    }
    onBeforeMount(() => productStore.getProducts(0, 'customer'))
    onMounted(() => productStore.getProduct(route.query.id))
</script>