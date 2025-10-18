<template>
  <LoadingC :is-full-page="true" :active="isLoading" />
  <button type="button" class="float-end btn btn-primary" @click="openModal('add')">新增文章</button>
  <table class="table">
    <thead>
      <tr>
        <th>標題</th>
        <th>作者</th>
        <th>建立日期</th>
        <th>公開</th>
        <th>動作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="article in articles" :key="article.id">
        <td>{{ article.title }}</td>
        <td>{{ article.author }}</td>
        <td>{{ new Date(article.create_at).toLocaleDateString() }}</td>
        <td>{{ article.isPublic ? '是' : '否' }}</td>
        <td>
          <div class="btn-group btn-group-sm">
            <button class="btn btn-outline-primary" @click="openModal('edit', article.id)">編輯</button>
            <button class="btn btn-outline-danger" @click="openModal('remove', article.id)">移除</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
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