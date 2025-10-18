// JavaScript source code
import { http } from "../util"
import useMessageStore from "./messages"
import useLoadingStore from "./loading"
export default {
  data () {
    return {
      product: {},
      products: [],
      pagination: {}
    }
  },
  methods: {
    addProduct () {
      http.post(
        `/api/${ process.env.VUE_APP_PATH }/admin/product/`,
        {
          data: this.product
        }
      ).then( ( response ) => {
        if ( response.data.success ) {
          useMessageStore.pushMessage( 'success', '新增商品成功', response.data.message )
        } else {
          response.data.message.forEach( ( msg ) => {
            useMessageStore.pushMessage( 'danger', '新增商品失敗', msg )
          } )
        }
      } ).catch( ( error ) => {
        useMessageStore.pushMessage( 'danger', '新增商品失敗', error?.message )
      } ).finally( () => {
        this.getProducts(1, 'admin')
      } )
    },
    editProduct () {
      http.put(
        `/api/${ process.env.VUE_APP_PATH }/admin/product/${ this.product.id }`,
        {
          data: this.product
        }
      ).then( ( response ) => {
        if ( response.data.success ) {
          useMessageStore.pushMessage( 'success', '變更商品成功', response.data.message )
        } else {
          response.data.message.forEach( ( msg ) => {
            useMessageStore.pushMessage( 'danger', '變更商品失敗', msg )
          } )
        }
      } ).catch( ( error ) => {
        useMessageStore.pushMessage( 'danger', '變更商品失敗', error?.message )
      } ).finally( () => {
        this.getProducts( 1, 'admin' )
      } )
    },
    getProduct ( id ) {
      useLoadingStore.data().isLoading = true
      this.product = {}
      http.get( `/api/${ process.env.VUE_APP_PATH }/product/${ id }` )
        .then( ( response ) => {
          if ( response.data.success ) {
            this.product = response.data.product
          } else {
            useMessageStore.pushMessage( 'danger', '取得單一商品失敗', response.data.message )
          }
        } ).catch( ( error ) => {
          useMessageStore.pushMessage( 'danger', '取得單一商品失敗', error?.message )
        } ).finally( () => {
          useLoadingStore.data().isLoading = false
        } )
    },
    getProducts ( page, role ) {
      useLoadingStore.data().isLoading = true
      let url = `/api/${ process.env.VUE_APP_PATH }/products`
      if ( role === 'admin' ) {
        url = `/api/${ process.env.VUE_APP_PATH }/admin/products`
      }
      if ( page ) {
        url += `?page=${ page }`
      }
      http.get( url )
        .then( ( response ) => {
          if ( response.data.success ) {
            this.products = response.data.products
            this.pagination = response.data.pagination
          } else {
            useMessageStore.pushMessage( 'danger', '取得商品列表失敗', response.data.message )
          }
        } ).catch( ( error ) => {
          useMessageStore.pushMessage( 'danger', '取得商品列表失敗', error?.message )
        } ).finally( () => {
          useLoadingStore.data().isLoading = false
        } )
    },
    removeProduct ( id ) {
      http.delete( `/api/${ process.env.VUE_APP_PATH }/admin/product/${ id }` )
        .then( ( response ) => {
          if ( response.data.success ) {
            useMessageStore.pushMessage( 'success', '刪除商品成功', response.data.message )
            this.getProducts( 1, 'admin' )
          } else {
            useMessageStore.pushMessage( 'danger', '刪除商品失敗', response.data.message )
          }
        } ).catch( ( error ) => {
          useMessageStore.pushMessage( 'danger', '刪除商品失敗', error?.message )
        } ).finally( function () {
          useLoadingStore.isLoading = false
          this.getProducts( 1, 'admin' )
        } )
    }
  }
}