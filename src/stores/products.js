import {reactive} from "vue"
import {http} from "../util"
import useMessageStore from "./messages"
import useLoadingStore from "./loading"
export default function () {
    const pagination = reactive({})
    const product = reactive({})
    const products = reactive([])
    const isLoading = useLoadingStore()
    const messageStore = useMessageStore()
    const getProduct = id => {
        isLoading.value = true
        http(`/api/${import.meta.env.VITE_PATH}/product/${id}`)
            .then(response => {
                if (response.data.success) Object.assign(product, response.data.product)
                else messageStore.pushMessage({
                    type: 'warning',
                    title: '取得單一商品失敗',
                    content: response.data.message
                })
            }).catch(error => {
                messageStore.pushMessage({
                    type: 'danger',
                    title: '取得單一商品失敗',
                    content: error.response?.data.message
                })
            }).finally(() => {
                isLoading.value = false
            })
    }
    const getProducts = (page, role) => {
        isLoading.value = true
        products.length = 0
        const payload = {url: `/api/${import.meta.env.VITE_PATH}`}
        if (role === 'admin') payload.url += '/admin/products'
        else payload.url += '/products'
        if (page===0)  payload.url += '/all'
        else payload.params = {page}
        http(payload)
            .then(response => {
                if (response.data.success) {
                    products.push(...response.data.products)
                    Object.assign(pagination, response.data.pagination)
                } else messageStore.pushMessage({
                    type: 'warning',
                    title: '取得商品列表失敗',
                    content: response.data.message
                })
            }).catch(error => {
                messageStore.pushMessage({
                    type: 'danger',
                    title: '取得商品列表失敗',
                    content: error.response?.data.message
                })
            }).finally(() => {
                isLoading.value = false
            })
    }
    return {
        pagination,
        product,
        products,
        getProduct,
        getProducts,
    }
}