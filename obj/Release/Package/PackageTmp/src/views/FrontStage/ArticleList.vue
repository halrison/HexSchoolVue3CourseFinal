<template>
  <LoadingC :is-full-page="true" :active="isLoading" />
  <div class="container">
    <div class="row">
      <nav class="col-3 bg-light float-start">
        <div class="position-sticky pt-3">
          <p>標籤篩選</p>
          <p class="form-check" v-for="tag in tags" :key="tag">
            <input class="form-check-input" type="checkbox" :value="tag" v-model="selected" />
            <label class="form-check-label">{{ tag }}</label>
          </p>
        </div>
      </nav>
      <div class="col-9 mt-1">
        <div class="card-group row">
          <div class="col-6 row" v-for="article in filterArticles || articles" :key="article.id">
            <ArticleCard :article="article" />
          </div>
        </div>
      </div>
    </div>
    <Pagination :pagination="pagination" v-show="pagination.total_pages > 1" @paginate="page => getArticles(page, 'customer')" />
  </div>
</template>

<script setup>
  import useArticleStore from '@/stores/articles'
  import useLoadingStore from "@/stores/loading"
  import ArticleCard from '@/components/ArticleCard.vue'
  import Pagination from '@/components/PaginationBar.vue'
  import { storeToRefs } from 'pinia'
  import { computed, onMounted, ref } from 'vue'

  const ArticleStore = useArticleStore()
  const { getArticles } = ArticleStore
  const { articles, pagination } = storeToRefs(ArticleStore)

  const { isLoading } = storeToRefs(useLoadingStore())

  const selected = ref([])
  const tags = computed(() => Array.from(new Set(articles.value.flatMap(article => article.tag))).filter(tag => !!tag))
  const filterArticles = computed(() =>{
    if(selected.value.length){
      return articles.value.filter(article =>{
        if(Object.hasOwn(article, 'tag')){ 
          return article.tag.some(t => selected.value.includes(t))
        }
      })
    }else{
      return articles.value
    }
  })

  onMounted(async function () {
    await getArticles(1, 'customer')
    selected.value = []
})
</script>