export default {
    injects: [ 'emitter' ],
    methods: {
        getCarts () {
            this.isLoading = true
            this.$http.get( `${ process.env.VUE_APP_API }/api/${ process.env.VUE_APP_PATH }/cart` )
            .then( response => {
                if ( response.data.success ) {
                    this.cartList = response.data.data.carts
                    this.total = response.data.data.total
                    this.final_total = response.data.data.final_total
                }else this.emitter.emit(
                    'message',
                    {
                        type: 'danger', 
                        title: '取得購物車失敗' ,
                        content: response?.data.message
                    }
                )
            } ).catch(  error=> {
                this.emitter.emit(
                    'message',
                    {
                        type: 'danger',
                        title: '取得購物車發生錯誤',
                        content: error.response?.data.message
                    }
                )
            } ).finally(() => {
                this.isLoading = false
            } )
        }
    },
    data () {
        return {
            cartItem: {},
            cartList: [],
            final_total: 0,
            total: 0,
            isLoading: false
        }
    }
}