import useLoadingStore from "@/stores/loading"
import useMessageStore from "@/stores/messages"
import { http } from "../util"
export default {
  data () {
    return {
      cartItem: {},
      cartList: [],
      final_total: 0,
      total: 0
    }
  },
  methods: {
    getCarts () {
      useLoadingStore.isLoading = true
      http.get( `/api/${ process.env.VUE_APP_PATH }/cart` )
        .then( function ( response ) {
          if ( response.data.success ) {
            this.cartList = response.data.data.carts
            this.total = response.data.data.total
            this.final_total = response.data.data.final_total
          }
        } ).catch( function ( error ) {
          useMessageStore.methods.pushMessage( 'danger', '取得購物車失敗', error?.message )
        } ).finally( function () {
          useLoadingStore.isLoading = false
        } )
    }
  }
}