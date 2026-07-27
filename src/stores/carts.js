import {reactive, ref} from "vue";
import {http} from "../util"
import useLoadingStore from "@/stores/loading"
import useMessageStore from "@/stores/messages"

let cartStoreInstance = null

function createCartStore() {
    const isLoading = useLoadingStore()
    const messageStore = useMessageStore()
    const cart = reactive({})
    const carts = reactive([])
    const subTotal = ref(0)
    const finalTotal = ref(0)

    const getCarts = () => {
        isLoading.value = true
        carts.length = 0
        http(`/api/${import.meta.env.VITE_PATH}/cart`)
            .then(response => {
                if (response.data.success) {
                    carts.push(...response.data.data.carts)
                    subTotal.value = response.data.data.total
                    finalTotal.value = response.data.data.final_total
                } else {
                    messageStore.pushMessage({
                        type: 'warning',
                        title: '取得購物車失敗',
                        content: response.data.message
                    })
                }
            }).catch(error => {
                messageStore.pushMessage({
                    type: 'danger',
                    title: '取得購物車失敗',
                    content: error.response?.data.message
                })
            }).finally(() => {
                isLoading.value = false
            })
    }

    return {
        cart,
        carts,
        finalTotal,
        subTotal,
        getCarts
    }
}

export default function () {
    if (!cartStoreInstance) {
        cartStoreInstance = createCartStore()
    }

    return cartStoreInstance
}
