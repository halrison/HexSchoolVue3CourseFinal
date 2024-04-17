<template>
  <LoadingC :is-full-page="true" :active="isLoading" />
  <button type="button" class="float-end btn btn-primary mt-1" @click="openModal('add')">新增文章</button>
  <div class="table-responsive-sm overflow-x-hidden mt-5">
    <table class="table table-striped">
      <thead>
        <tr class="row mx-0">
          <th class="col-sm-8 col-lg-4">標題</th>
          <th class="col-sm-4 col-lg-2">作者</th>
          <th class="col-sm-4 col-lg-2">建立日期</th>
          <th class="col-sm-4 col-lg-1">公開</th>
          <th class="col-sm-4 col-lg-3">動作</th>
        </tr>
      </thead>
      <tbody>
        <tr class="row mx-0" v-for="article in articles" :key="article.id">
          <td class="col-sm-8 col-lg-4">{{ article.title }}</td>
          <td class="col-sm-4 col-lg-2">{{ article.author }}</td>
          <td class="col-sm-4 col-lg-2">{{ new Date(article.create_at).toLocaleDateString() }}</td>
          <td class="col-sm-4 col-lg-1" 
            v-bind:class="article.isPublic ? 'text-success' : 'text-danger'">
            {{ article.isPublic ? '是' : '否' }}
          </td>
          <td class="col-sm-4 col-lg-3">
            <div class="btn-group">
              <button class="btn btn-outline-primary" @click="openModal('edit', article.id)">
                <i class="bi bi-pencil-square"></i>
                <span class="d-none d-lg-inline-block">編輯</span>
              </button>
              <button class="btn btn-outline-danger" @click="openModal('remove', article.id)">
                <i class="bi bi-trash"></i>
                <span class="d-none d-lg-inline-block">移除</span>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <Pagination :pagination="pagination" v-show="pagination.total_pages > 1" @paginate="page => ArticleStore.getArticles(page, 'admin')" />
  <ArticleModal ref="addEditModal" :article="article" />
  <RemoveModal type="文章" ref="removeModal" :item="article" />
</template>

<script setup>
  import { storeToRefs } from "pinia"
  import { computed, onMounted, ref } from "vue"
  import useArticleStore from "@/stores/articles"
  import useLoadingStore from "@/stores/loading"
  import Pagination from "@/components/PaginationBar.vue"
  import ArticleModal from "@/components/ArticleModal.vue"
  import RemoveModal from "@/components/RemoveModal.vue"


  const addEditModal = ref(null)
  const removeModal = ref(null)
  const article = ref({})

  const ArticleStore = useArticleStore()

  const { isLoading } = storeToRefs(useLoadingStore())

  const articles = computed(() => ArticleStore.articles)
  const pagination = computed(() => ArticleStore.pagination)


  onMounted(async function () {
    await ArticleStore.getArticles(1, 'admin')    
  })


  function openModal (action, id = '') {
    article.value = {}
    switch (action) {
      case 'add':
        article.value = {
          create_at: new Date().toISOString().split('T')[0],
          tag: []
        }
        addEditModal.value.show()
        break
      case 'edit':
        article.value = articles.value.find(article => article.id === id)
        article.value.create_at = new Date(article.value.create_at).toISOString().split('T')[0]
        addEditModal.value.show()
        break
      case 'remove':
        article.value = articles.value.find(article => article.id === id)
        removeModal.value.show()
        break
    }
  }
</script>