<template>
  <div class="modal fade" tabindex="-1" ref="DOM">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <span>移除{{ type }}</span>
          </h5>
        </div>
        <div class="modal-body">
          <p>您要移除{{ type==='購物車' ? item.product.title : item.title }}嗎？</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="hideModal">取消</button>
          <button type="button" class="btn btn-danger" @click="remove">確定</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import modal from "@/mixins/modal"
  export default {
    name: "RemoveModal",
    mixins: [ modal ],
    props: {
      item: {
        type: Object,
        default: () => ( {} )
      },
      type: {
        type: String,
        default: "項目"
      }
    },
    methods: {
      remove () {
        switch ( this.currentType ) {
          case '商品':
            this.removeProduct()
            break;
          case '優惠券':
            this.removeCoupon()
            break;
          case '訂單':
            this.removeOrder()
            break;
          case '文章':
            this.removeArticle()
            break;
        }
        this.$emit( 'remove' )
      },
      removeProduct () {
        this.$http.delete( `${ process.env.VUE_APP_API }/api/${ process.env.VUE_APP_PATH }/admin/product/${ this.$props.item.id }` )
          .then( ( { data } ) => {
            if ( data.success ) {
              this.emitter.emit( 'message', { title: '移除成功', message: data.message, type: 'success' } )
              this.hideModal()
            } else {
              this.emitter.emit( 'message', { title: '移除失敗', message: data.message, type: 'warning' } )
            }
          } ).catch( err => {
            this.emitter.emit( 'message', { title: '移除發生錯誤', message: err.response.data.message, type: 'danger' } )
          } )
      },
      removeCoupon () {
        this.$http.delete( `${ process.env.VUE_APP_API }/api/${ process.env.VUE_APP_PATH }/admin/coupon/${ this.$props.item.id }` )
          .then( ( { data } ) => {
            if ( data.success ) {
              this.emitter.emit( 'message', { title: '移除成功', message: data.message, type: 'success' } )
              this.hideModal()
            } else {
              this.emitter.emit( 'message', { title: '移除失敗', message: data.message, type: 'warning' } )
            }
          } ).catch( err => {
            this.emitter.emit( 'message', { title: '移除發生錯誤', message: err.response.data.message, type: 'danger' } )
          } )
      },
      removeOrder () {
        this.$http.delete( `${ process.env.VUE_APP_API }/api/${ process.env.VUE_APP_PATH }/admin/order/${ this.$props.item.id }` )
          .then( ( { data } ) => {
            if ( data.success ) {
              this.emitter.emit( 'message', { title: '移除成功', message: data.message, type: 'success' } )
              this.hideModal()
            } else {
              this.emitter.emit( 'message', { title: '移除失敗', message: data.message, type: 'warning' } )
            }
          } ).catch( err => {
            this.emitter.emit( 'message', { title: '移除發生錯誤', message: err.response.data.message, type: 'danger' } )
          } )
      },
      removeArticle () {
        this.$http.delete( `${ process.env.VUE_APP_API }/api/${ process.env.VUE_APP_PATH }/admin/article/${ this.$props.item.id }` )
          .then( ( { data } ) => {
            if ( data.success ) {
              this.emitter.emit( 'message', { title: '移除成功', message: data.message, type: 'success' } )
              this.hideModal()
            } else {
              this.emitter.emit( 'message', { title: '移除失敗', message: data.message, type: 'warning' } )
            }
          } ).catch( err => {
            this.emitter.emit( 'message', { title: '移除發生錯誤', message: err.response.data.message, type: 'danger' } )
          } )
      }
    }
  }
</script>