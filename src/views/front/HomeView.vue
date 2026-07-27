<template>
    <LoadingC v-bind:is-full-apge="true" v-bind:active="isLoading" />
    <div class="row justify-content-center my-auto">
        <div class="text-center">
            <h2 class="mt-3">Zay 生活用品店</h2>
            <p class="text-muted mb-0">你的品味，由你創造</p>
            <button class="btn btn-dark rounded-0 mt-6" v-on:click="scrollDown">立即搶折扣</button>
        </div>
    </div>
    <div class="row mt-4">
        <h2 class="text-center">熱銷商品</h2>
        <div class="h-auto">
            <Swiper v-bind:products="filterProducts.slice(0, 3)" />
        </div>
    </div>
    <div class="row bg-light">
        <h2 class="text-center mt-2">顧客評論</h2>
        <Carousel v-bind:items="Comments" v-slot="{ items }">
            <div class="carousel-item my-5" v-for="comment, index in items" v-bind:key="index" v-bind:class="{ 'active': index === 0 }">
                <div class="py-7 text-center">
                    <h3>{{ comment.message }}</h3>
                    <p>
                        <small>—{{ comment.author }}—</small>
                    </p>
                </div>
            </div>
        </Carousel>
    </div>
    <h2 class="text-center my-2">最新文章</h2>
    <div class="row m-auto" v-for="article in filterArticles.slice(0, 3)" :key="article.id">
        <ArticleCard v-bind:article="article" />
    </div>
    <div class="bg-light py-4" id="discount-area">
        <div class="container">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center align-items-start">
                <div class="input-group w-md-50 mt-md-0 mt-3">
                    <p class="me-1 fw-bold my-auto">輸入即享二折優惠</p>
                    <input type="text" class="form-control rounded-0" value="anniversity" readonly />
                    <div class="input-group-append">
                        <button class="btn btn-dark rounded-0" type="button" v-on:click="copyCoupon">
                            複製折扣碼
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
    import {computed, inject, onBeforeMount, onMounted, ref, reactive} from "vue"
    import useArticleStore from "@/stores/articles"
    import useLoadingStore from '@/stores/loading'
    import useMessageStore from '@/stores/messages'
    import useProductStore from "@/stores/products"
    import Carousel from "@/components/CarouselComponent.vue"
    import Swiper from "@/components/SwiperComponent.vue"
    import ArticleCard from "@/components/ArticleCard.vue"
    import Comments from "@/Comments.json"
    const articleStore = useArticleStore()
    const isLoading = useLoadingStore()
    const messageStore = useMessageStore()
    const productStore = useProductStore()
    const filterProducts = computed(() => productStore.products.filter(product => product.is_enabled))
    const filterArticles = computed(() => articleStore.articles.filter(article => article.isPublic))
    const scrollDown = () => {
        const discountArea = document.getElementById("discount-area");
        discountArea.scrollIntoView({behavior: "smooth"});
    }
    const copyCoupon = () => {
        const couponCode = document.getElementsByTagName("input")[0].value
        navigator.clipboard.writeText(couponCode)
            .then(() => {
                messageStore.pushMessage({
                    type: 'success',
                    title: '折扣碼已複製',
                    content: `折扣碼已複製到剪貼簿`
                })
            }).catch(() => {
                messageStore.pushMessage({
                    type: 'danger',
                    title: '複製失敗',
                    content: `無法複製折扣碼，請手動複製`
                })
            })
    }
    onBeforeMount(() => {
        productStore.getProducts(0, 'customer')
    })
    onMounted(() => {
        articleStore.getArticles(1, 'customer')
    })
</script>
<style scoped>
    h1 {
        font-weight: 500;
        font-size: 2.6rem;
        position: relative;
        top: -10px;
    }

    h3 {
        font-size: 1.2rem;
    }

    .greetings h1,
    .greetings h3 {
        text-align: center;
    }

    @media (min-width: 1024px) {
        .greetings h1,
        .greetings h3 {
            text-align: left;
        }
    }
</style>