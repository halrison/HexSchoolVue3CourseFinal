// JavaScript source code
import { http } from "../util"
import useLoadingStore from "@/stores/loading"
import useMessageStore from "@/stores/messages"
const { pushMessage } = useMessageStore
export default {
  data () {
    return {
      articles: [],
      article: {},
      pagination: {},
      isLoading: useLoadingStore.isLoading
    }
  },
  methods: {
    addArticle (article) {
      http.post(
        `/api/${process.env.VUE_APP_PATH}/admin/article`,
        {
          data: article
        }
      ).then(function (response) {
        if (response.data.success) {
          pushMessage('success', response.data.message)
        } else {
          response.data.message.forEach(function (msg) {
            pushMessage('danger', '新增文章失敗', msg)
          })
        }
      }).catch(function (error) {
        pushMessage('danger', '新增文章失敗', error?.message)
      }).finally(function () {
        this.getArticles(1, 'admin')
      })
    },
    editArticle (article) {
      http.put(
        `/api/${process.env.VUE_APP_PATH}/admin/article/${article.value.id}`,
        {
          data: article
        }
      ).then(function (response) {
        if (response.data.success) {
          pushMessage('success', response.data.message)
        } else {
          response.data.message.forEach(function (msg) {
            pushMessage('danger', '編輯文章失敗', msg)
          })
        }
      }).catch(function (error) {
        pushMessage('danger', '編輯文章失敗', error?.message)
      }).finally(function () {
        this.getArticles(1, 'admin')
      })
    },
    getArticle (id, role) {
      this.isLoading = true
      this.article = {}
      http.get(role === 'admin' ? `/api/${process.env.VUE_APP_PATH}/admin/article/${id}` : `/api/${process.env.VUE_APP_PATH}/article/${id}`)
        .then(function (response) {
          if (response.data.success) {
            this.article = response.data.article
            this.article.create_at = new Date(this.article.create_at || response.data.article.create_at).toISOString().split('T')[0]
            this.isLoading = false
          }
        }).catch(function (error) {
          pushMessage('danger', '取得文章失敗', error?.message)
        })
    },
    getArticles (page, role) {
      this.isLoading = true
      this.articles = []
      http.get(
        role === 'admin' ? `/api/${process.env.VUE_APP_PATH}/admin/articles` : `/api/${process.env.VUE_APP_PATH}/articles`,
        { params: { page } }
      ).then(function (response) {
        if (response.data.success) {
          this.articles = response.data.articles
          this.pagination = response.data.pagination
          this.isLoading = false
        }
      }).catch(function (error) {
        pushMessage('danger', '取得文章失敗', error?.message)
      })
    },
    removeArticle (article) {
      http.delete(`/api/${process.env.VUE_APP_PATH}/admin/article/${article.id}`)
        .then(function (response) {
          if (response.data.success) {
            pushMessage('success', response.data.message)
          } else {
            response.data.message.forEach(function (msg) {
              pushMessage('danger', msg)
            })
          }
        }).catch(function (error) {
          pushMessage('danger', '刪除文章失敗', error?.message)
        }).finally(function () {
          this.getArticles(1, 'admin')
        })
    }
  }
}