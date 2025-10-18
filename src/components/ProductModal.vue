<template>
  <div class="modal fade" tabindex="-1" ref="DOM">
    <div class="modal-dialog modal-xl" role="dialog">
      <FormC class="modal-content border-0" v-slot="{ errors }" @submit="$emit('add-edit',tempProduct)" @reset="hideModal" :initial-value="product" :initial-errors="error">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title">
            <span>{{ tempProduct.id ? '編輯' : '新增' }}產品</span>
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
                          v-model="tempUrl" v-bind:class="{ 'is-invalid': errors['url'] }" :standalone="true" />
                  <button id="addImage" type="button" class="btn btn-outline-primary btn-sm"
                          @click="AddImage(tempUrl, url => addImage(url))" v-bind:disabled="!tempUrl">
                    新增圖片
                  </button>
                </p>
                <ErrorMessage class="invalid-feedback" name="url" />
              </div>
              <div class="mb-3">
                <label for="input" class="form-label">或上傳圖片</label>
                <FieldC class="form-control" name="file" type="file" rules="image" label="選取檔案"
                        @change="event => UploadImage(event.target.files)" :standalone="true" />
                <ErrorMessage name="file" class="invalid-feedback" :style="{ 'display': errors['file'] ? 'block' : 'none' }" />
              </div>
              <div class="mt-5 mb-3 input-group">
                <div class="mb-3 input-group" v-show="tempProduct.imageUrl">
                  主圖片
                  <input type="url" class="form-control" readonly placeholder="請輸入連結"
                         :value="tempProduct.imageUrl" />
                  <button type="button" class="btn btn-outline-danger" @click="delete tempProduct.imageUrl">
                    移除
                  </button>
                </div>
                <div class="mb-3 input-group" v-for="url,index in tempProduct.imagesUrl" :key="index">
                  副圖片{{ index + 1 }}
                  <input type="url" class="form-control" readonly placeholder="請輸入連結"
                         :value="url" />
                  <button type="button" class="btn btn-outline-danger" @click="tempProduct.imagesUrl.splice(index, 1)">
                    移除
                  </button>
                </div>
              </div>
            </div>
            <div class="col-sm-8">
              <div class="mb-3">
                <label for="title" class="form-label">標題</label>
                <FieldC type="text" class="form-control" id="title" label="標題" name="title" placeholder="請輸入標題"
                        v-model="tempProduct.title" v-bind:class="{ 'is-invalid': errors['title'] }" />
                <ErrorMessage class="invalid-feedback" name="title" />
              </div>
              <div class="row gx-2">
                <div class="mb-3 col-md-6">
                  <label for="category" class="form-label">分類</label>
                  <FieldC type="text" class="form-control" id="category" placeholder="請輸入分類" label="分類" name="category"
                          v-model="tempProduct.category" v-bind:class="{ 'is-invalid': errors['category'] }" />
                  <ErrorMessage class="invalid-feedback" name="category" />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">單位</label>
                  <FieldC type="text" class="form-control" id="unit" label="單位" name="unit" placeholder="請輸入單位"
                          v-model="tempProduct.unit" v-bind:class="{ 'is-invalid': errors['unit'] }" />
                  <ErrorMessage class="invalid-feedback" name="unit" />
                </div>
              </div>
              <div class="row gx-2">
                <div class="mb-3 col-md-6">
                  <label for="origin_price" class="form-label">原價</label>
                  <FieldC type="number" class="form-control" id="origin_price" min="1" rules="integer" placeholder="請輸入原價" label="原價" name="origin_price"
                          v-model="tempProduct.origin_price" v-bind:class="{ 'is-invalid': errors['origin_price'] }" />
                  <ErrorMessage class="invalid-feedback" name="origin_price" />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">售價</label>
                  <FieldC type="number" class="form-control" id="price" min="1" label="售價" name="price" rules="integer" placeholder="請輸入售價"
                          v-model="tempProduct.price" :max="tempProduct.price" v-bind:class="{ 'is-invalid': errors['price'] }" />
                  <ErrorMessage class="invalid-feedback" name="price" />
                </div>
              </div>
              <hr>
              <div class="mb-3">
                <label for="description" class="form-label">產品描述</label>
                <textarea type="text" class="form-control" id="description" placeholder="請輸入產品描述"
                          v-model="tempProduct.description"></textarea>
              </div>
              <div class="mb-3">
                <label for="content" class="form-label">說明內容</label>
                <textarea type="text" class="form-control" id="content" placeholder="請輸入產品說明內容"
                          v-model="tempProduct.content"></textarea>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="is_enabled"
                         v-model="tempProduct.is_enabled" :true-value="1" :false-value="0" />
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
<script>
  import modal from "@/mixins/modal"
  import { addImage, uploadImage } from "@/util"
  export default {
    name: "ProductModal",
    mixins: [ modal ],
    methods: {
      AddImage ( url ) {
        addImage(
          url,
          imgUrl => {
            if ( this.tempProduct.imageUrl ) {
              this.tempProduct.imagesUrl.push( this.tempProduct.imageUrl )
            } else {
              this.tempProduct.imageUrl = imgUrl
            }
            this.tempUrl = ''
          }
        )
      },
      UploadImage ( files ) {
        uploadImage(
          files,
          url => {
            this.AddImage( url )
            this.emitter.emit( 'message', {
              type: 'success',
              title: '圖片上傳成功',
              content: `已上傳至${ url }`
            } )
          } )
      }
    },
    props: {
      product: {
        type: Object,
        default: () => ( {
          title: '',
          category: '',
          unit: '',
          origin_price: 0,
          price: 0,
          description: '',
          content: '',
          is_enabled: 0,
          imagesUrl: [],
          num:0
        } )
      }
    },
    watch: {
      product ( newValue ) {
        this.tempProduct = { ...newValue }
        this.error = {}
      }
    },
    data () {
      return {
        tempProduct: {},
        tempUrl: '',
        error: {}
      };
    }
  }
</script>