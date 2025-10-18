<template>
  <div class="modal fade" tabindex="-1" ref="DOM">
    <div class="modal-dialog modal-xl" role="dialog">
      <FormC class="modal-content border-0" v-slot="{ errors }" @submit="addOrEditProduct" @reset="hide">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="exampleModalLabel">
            <span>{{ ProductStore.product.id ? '變更' : '新增' }}產品</span>
          </h5>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-4">
              <div>
                <label for="image" class="form-label">輸入圖片網址</label>
                <br />
                <p class="mb-3 input-group">
                  <FieldC label="圖片網址" name="url" rules="url" type="text" class="form-control" id="image" aria-describedby="addImage" placeholder="請輸入圖片連結"
                     v-model="tempUrl" :standalone="true" :class="{ 'is-invalid': errors['url'] }"/>
                  <button id="addImage" type="button" class="btn btn-outline-primary btn-sm"
                    @click="AddImage(tempUrl, url => addImage(url))" :disabled="!tempUrl">
                    新增圖片
                  </button>
                </p>
                <ErrorMessage class="invalid-feedback" name="url" />
              </div>
              <div class="mb-3">
                <label for="input" class="form-label">或上傳圖片</label>
                <FieldC class="form-control" name="file" type="file" rules="image" label="選取檔案"
                  @change="event => UploadImage(event.target.files, url=>addImage(url))" :standalone="true"/>
                <ErrorMessage name="file" class="invalid-feedback" :style="{ 'display': errors['file'] ? 'block' : 'none' }"/>
              </div>
              <div class="mt-5 mb-3 input-group">
                <div class="mb-3 input-group" v-show="ProductStore.product.imageUrl">
                  主圖片
                  <input type="url" class="form-control" readonly  placeholder="請輸入連結"
                    :value="ProductStore.product.imageUrl"/>
                  <button type="button" class="btn btn-outline-danger" @click="delete ProductStore.product.imageUrl">
                    移除
                  </button>
                </div>
                <div class="mb-3 input-group" v-for="url,index in ProductStore.product.imagesUrl" :key="index">
                  副圖片{{ index + 1 }}
                  <input type="url" class="form-control" readonly placeholder="請輸入連結"
                    :value="url" />
                  <button type="button" class="btn btn-outline-danger" @click="ProductStore.product.imagesUrl.splice(index, 1)">
                    移除
                  </button>
                </div>
              </div>
            </div>
            <div class="col-sm-8">
              <div class="mb-3">
                <label for="title" class="form-label">標題</label>
                <FieldC type="text" class="form-control" id="title" label="標題" name="title" rules="required" placeholder="請輸入標題"
                  v-model="ProductStore.product.title"  :class="{ 'is-invalid': errors['title'] }"/>
                <ErrorMessage class="invalid-feedback" name="title" />
              </div>
              <div class="row gx-2">
                <div class="mb-3 col-md-6">
                  <label for="category" class="form-label">分類</label>
                  <FieldC type="text" class="form-control" id="category" rules="required" placeholder="請輸入分類" label="分類" name="category"
                    v-model="ProductStore.product.category"  :class="{ 'is-invalid': errors['category'] }"/>
                  <ErrorMessage class="invalid-feedback" name="category" />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">單位</label>
                  <FieldC type="text" class="form-control" id="unit" label="單位" name="unit" rules="required" placeholder="請輸入單位"
                    v-model="ProductStore.product.unit"  :class="{ 'is-invalid': errors['unit'] }"/>
                  <ErrorMessage class="invalid-feedback" name="unit" />
                </div>
              </div>
              <div class="row gx-2">
                <div class="mb-3 col-md-6">
                  <label for="origin_price" class="form-label">原價</label>
                  <FieldC type="number" class="form-control" id="origin_price" min="1" rules="required|integer" placeholder="請輸入原價" label="原價" name="origin_price"
                    v-model="ProductStore.product.origin_price"  :class="{ 'is-invalid': errors['origin_price'] }"/>
                  <ErrorMessage class="invalid-feedback" name="origin_price" />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">售價</label>
                  <FieldC type="number" class="form-control" id="price" min="1" label="售價" name="price" rules="required|integer" placeholder="請輸入售價"
                    v-model="ProductStore.product.price" :max="ProductStore.product.price"  :class="{ 'is-invalid': errors['price'] }"/>
                  <ErrorMessage class="invalid-feedback" name="price" />
                </div>
              </div>
              <hr>
              <div class="mb-3">
                <label for="description" class="form-label">產品描述</label>
                <textarea type="text" class="form-control" id="description" placeholder="請輸入產品描述"
                  v-model="ProductStore.product.description"></textarea>
              </div>
              <div class="mb-3">
                <label for="content" class="form-label">說明內容</label>
                <textarea type="text" class="form-control" id="content" placeholder="請輸入產品說明內容"
                  v-model="ProductStore.product.content"></textarea>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="is_enabled"
                    v-model="ProductStore.product.is_enabled" :true-value="1" :false-value="0" />
                  <label class="form-check-label" for="is_enabled">
                    是否啟用
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-primary">確認</button>
          <button type="reset" class="btn btn-danger">取消 </button>
        </div>
      </FormC>
    </div>
  </div>
</template>

<script setup>
  import useProductStore from "@/stores/products"
  import useLoadingStore from "@/stores/loading"
  import useMessageStore from "@/stores/messages"
  import { Modal } from "bootstrap"
  import { storeToRefs } from "pinia"
  import { defineExpose, onMounted, ref, watch } from "vue"
  import { uploadImage as UploadImage, addImage as AddImage } from "../util"

  const tempUrl = ref('')
  const DOM = ref(null)
  const prop = defineProps(['product'])
  const ProductStore = useProductStore()
  const { product }=storeToRefs(ProductStore)
  let modal

  onMounted(function () {
    modal = new Modal(DOM.value)
  })
  watch(
    ()=>prop.product,
    async function(newValue){
      product.value=newValue
      if (product.value.id) ProductStore.getProduct(product.value.id)
  })
  defineExpose({ show })

  function addImage (url) {
    if (ProductStore.product.imageUrl) {
      ProductStore.product.imagesUrl ||= []
      ProductStore.product.imagesUrl.push(url)
    } else { 
      ProductStore.product.imageUrl = url
    }
    tempUrl.value=''
  } 
  function addOrEditProduct () {
    if (ProductStore.product.id) {
      ProductStore.editProduct()
    } else {
      ProductStore.addProduct()
    }
    hide()
  }
  function show () {  
    modal.show()
  }
  function hide () { 
    modal.hide()
    ProductStore.getProducts(1,'admin')
  }
</script>