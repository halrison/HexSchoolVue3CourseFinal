<template>
    <LoadingC :is-full-page="true" :active="isLoading" />
    <div class="container">
        <div class="row">
            <nav class="col-sm-3 bg-light">
                <div class="position-sticky pt-3">
                    <p>標籤篩選</p>
                    <p class="form-check" v-for="tag in tags" :key="tag">
                        <input class="form-check-input" type="checkbox" :value="tag" v-model="selected" />
                        <label class="form-check-label">{{ tag }}</label>
                    </p>
                </div>
            </nav>
            <div class="col-sm-9 mt-1">
                <div class="card-group row">
                    <div class="col-12 col-md-6 col-lg-4 row" v-for="article in filterArticles" :key="article.id">
                        <ArticleCard :article="article" />
                    </div>
                </div>
            </div>
        </div>
        <Pagination :pagination="articleStore.pagination" v-show="articleStore.pagination.total_pages > 1" @paginate="articleStore.getArticles" />
    </div>
</template>
<script setup>
    import {computed, onMounted, reactive} from 'vue'
    import useArticleStore from '@/stores/articles'
    import useLoadingStore from '@/stores/loading'
    import ArticleCard from '@/components/ArticleCard.vue'
    import Pagination from '@/components/PaginationBar.vue'
    const articleStore = useArticleStore()
    const isLoading = useLoadingStore()
    const filterArticles = computed(function () {
        if (selected.length) {
            return articleStore.articles.filter(article => {
                if (article?.tag) return articleStore.article.tag.some(t => selected.includes(t))
            });
        } else {
            return articleStore.articles
        }
    })
    const tags = computed(() => Array.from(new Set(articleStore.articles.flatMap(article => article.tag))).filter(tag => !!tag))
    const selected = reactive([])
    onMounted(() => {
        articleStore.getArticles(1, 'customer')
    })
</script>
