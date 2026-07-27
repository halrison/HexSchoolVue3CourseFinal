import {reactive} from 'vue'
import {http} from '../util'
import useLoadingStore from './loading'
import useMessageStore from './messages'
export default function () {
    const isLoading = useLoadingStore()
    const messageStore = useMessageStore()
    const order = reactive({})
    const orders = reactive([])
    const pagination = reactive({})
    const getOrder = id => {
        isLoading.value = true;
        http(`/api/${import.meta.env.VITE_PATH}/order/${id}`
        ).then(response => {
            if (response.data.success) Object.assign(order, response.data.order)
            else messageStore.pushMessage('warning', '取得訂單明細失敗', response.data.message)
        }).catch(error => {
            messageStore.pushMessage('danger', '取得訂單明細失敗', error.response?.data.message)
        }).finally(() => {
            isLoading.value = false;
        });
    }
    const getOrders = (page, role) => {
        isLoading.value = true
        orders.length = 0
        let url = `/api/${import.meta.env.VITE_PATH}`
        if (role === 'admin') url += '/admin/orders'
        else url += '/orders'
        http({
            url,
            method: 'get',
            params: {page}
        }).then(response => {
            if (response.data.success) {
                orders.push(...response.data.orders)
                Object.assign(pagination, response.data.pagination)
            } else messageStore.pushMessage('warning', '取得訂單列表失敗', response.data.message)
        }).catch(error => {
            messageStore.pushMessage('danger', '取得訂單列表失敗', error.response?.data.message)
        }).finally(() => {
            isLoading.value = false
        });
    }
    return {order, orders, pagination, getOrder, getOrders}
}