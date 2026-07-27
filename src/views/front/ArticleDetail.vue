<template>
    <LoadingC :active="loadingStore.isLoading.value" :is-full-page="true" />
    <div class="container">
        <div class="row">
            <h1 class=" text-center">{{ articleStore.article.title }}</h1>
        </div>
        <div class="row">
            <h6 class="text-center">{{ articleStore.article.description }}</h6>
        </div>
        <img class="d-block mx-auto w-100" :src="articleStore.article.image" />
        <p class="row">{{ articleStore.article.content }}</p>
    </div>
</template>
<script setup>
    import {onMounted} from 'vue'
    import {useRoute} from 'vue-router'
    import useArticleStore from '@/stores/articles'
    import useLoadingStore from '@/stores/loading'
    const articleStore = useArticleStore()
    const loadingStore = useLoadingStore()
    const route = useRoute()
    onMounted(() => {articleStore.getArticle(route.query.id)})
</script>