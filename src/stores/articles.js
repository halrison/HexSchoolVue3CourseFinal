import {reactive} from 'vue'
import {http, transDate} from '@/util';
import useLoadingStore from "./loading"
import useMessageStore from "./messages"
export default function () {
    const isLoading = useLoadingStore()
    const messageStore = useMessageStore()
    const article = reactive({})
    const articles = reactive([])
    const pagination = reactive({})
    const getArticle = (id, role) => {
        isLoading.value = true
        let url = `/api/${import.meta.env.VITE_PATH}`
        if (role === 'admin') url += `/admin/article/${id}`
        else url += `/article/${id}`
        return http(url)
            .then(response => {
                if (response.data.success) {
                    Object.assign(article, response.data.article)
                    article.create_at = transDate(article.create_at)
                } else {
                    messageStore.pushMessage({
                        type: 'warning',
                        title: '取得文章失敗',
                        content: response.data.message
                    })
                }
                return response
            }).catch(error => {
                messageStore.pushMessage({
                    type: 'danger',
                    title: '取得文章發生錯誤',
                    content: error.response?.data.message
                })
                return error.response
            }).finally(() => {isLoading.value = false})
    }
    const getArticles = (page, role) => {
        isLoading.value = true
        articles.length = 0
        const payload = {
            url: `/api/${import.meta.env.VITE_PATH}`,
            params: {page}
        }
        if (role === 'admin') payload.url += '/admin/articles'
        else payload.url += '/articles'
        http(payload).then(response => {
            if (response.data.success) {
                articles.push(...response.data.articles)
                Object.assign(pagination, response.data.pagination)
            } else messageStore.pushMessage({
                type: 'dwarning',
                title: '取得文章失敗',
                content: response.data.message
            })
        }).catch(error => {
            messageStore.pushMessage({
                type: 'danger',
                title: '取得文章發生錯誤',
                content: error.response?.data.message
            })
        }).finally(() => {isLoading.value = false})
    }
    return {article, articles, pagination, getArticle, getArticles}
}