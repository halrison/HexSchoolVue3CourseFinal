<template>
  <div class="modal fade" tabindex="-1" ref="DOM">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
        </div>
        <div class="modal-body">
          <p>您要{{title}}嗎？</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="hide">取消</button>
          <button type="button" class="btn btn-danger" @click="remove">確定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { storeToRefs } from "pinia"
  import { defineExpose, onMounted, ref, watch } from "vue"
  import { Modal } from "bootstrap"
  import useLoadingStore from "@/stores/loading"
  import useProductStore from '@/stores/products'
  import useOrderStore from '@/stores/orders'
  import useCouponStore from "@/stores/coupons"
  import useCartStore from "@/stores/carts"
  import useArticleStore from "@/stores/articles"


  const DOM = ref(null)
  const prop = defineProps([ 'item', 'type' ])
  const cart = ref({})
  const title = ref('')

  const ProductStore = useProductStore()
  const { removeProduct } = ProductStore
  const { product } = storeToRefs(ProductStore)

  const OrderStore = useOrderStore()
  const { removeOrder, removeOrders } = OrderStore
  const { order } = storeToRefs(OrderStore)

  const CouponStore = useCouponStore()
  const { removeCoupon } = CouponStore
  const { coupon } = storeToRefs(CouponStore)

  const ArticleStore = useArticleStore()
  const { removeArticle } = ArticleStore
  const { article } = storeToRefs(ArticleStore)

  const { removeCart, removeCarts } = useCartStore()
  let modal

  onMounted(function () {
    modal = new Modal(DOM.value)
  })
  watch(
    prop,
    function (newValue) {
      switch (newValue.type) {
        case '單一訂單':
          title.value = `移除訂單編號${newValue.item.id}`
          break
        case '所有訂單':
          title.value = '移除所有訂單'
          break
        case '單一購物車':
          title.value = `移除${newValue.item.product.title}`
          break
        case '所有購物車':
          title.value = '清空購物車'
          break
        default:
          title.value = `移除${newValue.item.title}`
      }
    }
  )
  defineExpose({ show })

  function show () { 
    modal.show()
  }
  function hide () {
    modal.hide() 
  }
  async function remove () {
    switch (prop.type) {
      case '產品':
        product.value = prop.item
        await removeProduct()
        break
      case '優惠券':
        coupon.value = prop.item
        await removeCoupon()
        break
      case '單一訂單':
        order.value = prop.item
        await removeOrder()
        break
      case '所有訂單':
        await removeOrders()
        break
      case '單一購物車':
        cart.value = prop.item
        await removeCart()
        break
      case '所有購物車':
        await removeCarts()
        break
      case '文章':
        article.value = prop.item
        await removeArticle(article.value)
        break
    }
    hide()
  }
</script>