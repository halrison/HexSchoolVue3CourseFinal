<template>
    <div class="container">
        <div class="d-flex justify-content-end me-1">
            <button type="button" class="btn btn-outline-info mt-2" @click="openModal('add')">
                <i class="bi bi-plus me-1"></i>
                新增商品
            </button>
        </div>
        <LoadingC :is-full-page="true" :active="isLoading" />
        <div class="table-responsive-sm overflow-x-hidden mt-3">
            <table class="table table-striped">
                <thead>
                    <tr class="row mx-0">
                        <th class="col-4 col-lg-2">分類</th>
                        <th class="col-8 col-lg-4">產品名稱</th>
                        <th class="col-4 col-sm-3 col-lg-1 text-lg-end">原價</th>
                        <th class="col-4 col-sm-3 col-lg-1 text-lg-end">售價</th>
                        <th class="col-4 col-sm-2 col-lg-1 text-lg-center">狀態</th>
                        <th class="col-sm-4 col-lg-3 text-center">動作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="row mx-0" v-for="product in products" :key="product.id">
                        <td class="col-4 col-lg-2">{{ product.category }}</td>
                        <td class="col-8 col-lg-4">{{ product.title }}</td>
                        <td class="col-4 col-sm-3 col-lg-1 text-lg-end">{{ $filters.currency(product.origin_price) }}</td>
                        <td class="col-4 col-sm-3 col-lg-1 text-lg-end">{{ $filters.currency(product.price) }}</td>
                        <td class="col-4 col-sm-2 col-lg-1 text-lg-center">
                            <div v-bind:class="product.is_enabled === 1 ? 'text-success' : 'text-danger'">
                                {{ product.is_enabled === 1 ? '啟' : '停' }}用
                            </div>
                        </td>
                        <td class="col-sm-4 col-lg-3">
                            <div class="btn-group btn-group-sm w-100">
                                <button @click="openModal('modify',product)" class="btn btn-outline-warning">
                                    <i class="bi bi-pencil-square me-1"></i>
                                    編輯
                                </button>
                                <button @click="openModal('remove',product)" class="btn btn-outline-danger">
                                    <i class="bi bi-trash me-1"></i>
                                    移除
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <Pagination :pagination="pagination" v-show="pagination.total_pages > 1" @paginate="getProducts" />
        <Modal size="xl" ref="AddEditModal">
            <FormC class="modal-content border-0"
                   v-slot="{ errors }" ref="form"
                   @submit="$emit('add-edit',tempProduct)" @reset="hideModal"
                   :initial-value="product" :initial-errors="error" :validation-schema="schema">
                <div class="modal-header bg-dark text-white">
                    <h5 class="modal-title">{{ tempProduct.id ? '編輯' : '新增' }}產品</h5>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-xl-4">
                            <div>
                                <label for="image-url" class="form-label">輸入圖片網址</label>
                                <br />
                                <p class="mb-3 input-group">
                                    <FieldC label="圖片網址" name="url" rules="url" type="text" class="form-control" id="image-url" aria-describedby="addImage" placeholder="請輸入圖片連結" as="input"
                                            v-model="tempUrl" v-bind:class="{ 'is-invalid': errors['url'] }" :standalone="true" />
                                    <button id="addImage" type="button" class="btn btn-outline-primary btn-sm"
                                            @click="AddImage(tempUrl, url => addImage(url))" v-bind:disabled="!tempUrl">
                                        新增圖片
                                    </button>
                                </p>
                                <ErrorMessage class="invalid-feedback" name="url" />
                            </div>
                            <div class="mb-3">
                                <label for="image-file" class="form-label">或上傳圖片</label>
                                <FieldC class="form-control" name="file" type="file" label="選取檔案" rules="ext:jpg,png|size:3072" id="image-file" as="input"
                                        @change="event => UploadImage(event.target.files[0])" :standalone="true" v-bind:class="{ 'is-invalid': errors['file'] }" />
                                <ErrorMessage name="file" class="invalid-feedback" :style="{ 'display': errors['file'] ? 'block' : 'none' }" />
                            </div>
                            <div class="mt-5 mb-3 input-group">
                                <div class="mb-3 input-group" v-show="tempProduct.imageUrl">
                                    主圖片
                                    <input type="url" class="form-control ms-1" readonly placeholder="請輸入連結"
                                           :value="tempProduct.imageUrl" />
                                    <button type="button" class="btn btn-outline-danger" @click="delete tempProduct.imageUrl">
                                        移除
                                    </button>
                                </div>
                                <div class="mb-3 input-group" v-for="url,index in tempProduct.imagesUrl" :key="index">
                                    副圖片{{ index + 1 }}
                                    <input type="url" class="form-control ms-1" readonly placeholder="請輸入連結"
                                           :value="url" />
                                    <button type="button" class="btn btn-outline-danger" @click="tempProduct.imagesUrl.splice(index, 1)">
                                        移除
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-8">
                            <div class="row gx-2 mb-3">
                                <label for="title" class="form-label col-3">標題</label>
                                <FieldC type="text" class="form-control col-9" id="title" label="標題" name="title" placeholder="請輸入標題" as="input"
                                         v-bind:class="{ 'is-invalid': errors['title'] }" />
                                <ErrorMessage class="invalid-feedback" name="title" />
                            </div>
                            <div class="row gx-2">
                                <div class="mb-3 col-6">
                                    <label for="category" class="form-label">分類</label>
                                    <FieldC type="text" class="form-control" id="category" placeholder="請輸入分類" label="分類" name="category"
                                             v-bind:class="{ 'is-invalid': errors['category'] }" />
                                    <ErrorMessage class="invalid-feedback" name="category" />
                                </div>
                                <div class="mb-3 col-6">
                                    <label for="price" class="form-label">單位</label>
                                    <FieldC type="text" class="form-control" id="unit" label="單位" name="unit" placeholder="請輸入單位" as="input"
                                            v-bind:class="{ 'is-invalid': errors['unit'] }" />
                                    <ErrorMessage class="invalid-feedback" name="unit" />
                                </div>
                            </div>
                            <div class="row gx-2">
                                <div class="mb-3 col-6">
                                    <label for="origin_price" class="form-label">原價</label>
                                    <FieldC type="number" class="form-control" id="origin_price" min="1" placeholder="請輸入原價" label="原價" name="origin_price" as="input"
                                            v-model="tempProduct.origin_price" v-bind:class="{ 'is-invalid': errors['origin_price'] }" />
                                    <ErrorMessage class="invalid-feedback" name="origin_price" />
                                </div>
                                <div class="mb-3 col-6">
                                    <label for="price" class="form-label">售價</label>
                                    <FieldC type="number" class="form-control" id="price" min="1" label="售價" name="price" placeholder="請輸入售價" as="input"
                                            v-model="tempProduct.price" :max="tempProduct.price" v-bind:class="{ 'is-invalid': errors['price'] }" />
                                    <ErrorMessage class="invalid-feedback" name="price" />
                                </div>
                            </div>
                            <hr>
                            <div class="mb-3">
                                <label for="description" class="form-label">產品描述</label>
                                <FieldC class="form-control" id="description" placeholder="請輸入產品描述" as="textarea"
                                          name="description"></FieldC>
                            </div>
                            <div class="mb-3">
                                <label for="content" class="form-label">說明內容</label>
                                <FieldC class="form-control" id="content" placeholder="請輸入產品說明內容" as="textarea"
                                          name="content"></FieldC>
                            </div>
                            <div class="mb-3">
                                <div class="form-check">
                                    <FieldC class="form-check-input" type="checkbox" id="is_enabled" label="是否啟用" name="is_enabled" as="input"
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
                    <button type="reset" class="btn btn-secondary">取消 </button>
                </div>
            </FormC>
        </Modal>
        <Modal size="md" ref="RemoveModal">
            <div class="modal-content border-0">
                <div class="modal-header bg-dark text-white">
                    <h5 class="modal-title">移除產品</h5>
                </div>
                <div class="modal-body">
                    <p>您要移除產品 {{ product.title }} 嗎？</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="$refs.RemoveModal.hideModal()">取消</button>
                    <button type="button" class="btn btn-danger" @click="removeProduct(product.id)">確定</button>
                </div>
            </div>
            </Modal>
    </div>
</template>
<script>
  import Pagination from '@/components/PaginationBar.vue'
  import Modal from '@/components/ModalComponent.vue'
  export default {
    name: 'ProductManage',
    components: { Pagination, Modal  },
    inject: [ 'emitter' ],
    computed:{
        schema(){
          return {
            title: 'required',
            category: 'required',
            unit: 'required',
            origin_price: 'required|integer',
            price: 'required|integer'
          }
        }
    },
    methods: {
      addEditProduct ( tempProduct ) {
        this.product = tempProduct
        const type = this.product.id ? 'put' : 'post'
        const api = this.product.id ? `${ process.env.VUE_APP_API }/api/${ process.env.VUE_APP_PATH }/admin/product/${ this.product.id }` : `${ process.env.VUE_APP_API }/api/${ process.env.VUE_APP_PATH }/admin/product`
        this.$http[ type ](
          api,
          { data: this.product } )
          .then( res => {
            if ( res.data.success ) {
              this.$refs.AddEditModal.hideModal()
              this.emitter.emit(
                  'message',
                  { 
                      type: 'success', 
                      title: `${type==='put' ? '變更' :'新增'}產品成功`, 
                      content: res.data.message
                  } 
              )
              this.getProducts() 
            } else {
              this.emitter.emit(
                  'message', 
                  {
                      type: 'warning',
                      title: `${type==='put' ? '變更' :'新增'}產品失敗`,
                      content: res.data.message
                  } 
              )
            }
          } )
          .catch( err => {
            err.response.data.message.forEach( msg => {
              this.emitter.emit(
                  'message', 
                  { 
                      type: 'danger', 
                      title: `${type==='put' ? '變更' :'新增'}產品發生錯誤`,
                      content: msg
                  } 
              )
            } )
          } )
      },
      getProducts ( page = 1 ) {
        this.isLoading = true
        this.$http.get(
          `${ process.env.VUE_APP_API }/api/${ process.env.VUE_APP_PATH }/admin/products`,
          { params: { page } }
          ).then( res => {
            if ( res.data.success ) {
              this.products = res.data.products
              this.pagination = res.data.pagination
            } else {
              this.emitter.emit(
                  'message',
                  {
                      type: 'danger',
                      title: '取得產品列表失敗',
                      content: res.data.message
                  } 
              )
            }
          } ).catch( err => {
            this.emitter.emit(
                'message',
                { 
                    type: 'danger',
                    title: '取得產品列表發生錯誤', 
                    content: err.response.data.message
                }
            )
          } ).finally( () => { this.isLoading = false } )
      },
      openModal ( action, item ) {
        switch ( action ) {
          case 'add':
            this.product = {}
            this.$refs.AddEditModal.showModal()
            break
          case 'modify':
            this.product = item 
            this.$refs.AddEditModal.showModal()
            break
          case 'remove':
            this.product = item 
            this.$refs.RemoveModal.showModal()
            break
        }
      },
      removeProduct (id) {
        this.$http.delete( `${ process.env.VUE_APP_API }/api/${ process.env.VUE_APP_PATH }/admin/product/${ id }` )
          .then( ( { data } ) => {
            if ( data.success ) {
              this.$refs.RemoveModal.hideModal()
              this.emitter?.emit( 
                  'message', 
                  {
                      title: '移除產品成功',
                      message: data.message, 
                      type: 'success' 
                  } 
              )
              this.getProducts()
            } else {
              this.emitter?.emit(
                  'message',
                  {
                      title: '移除產品失敗', 
                      message: data.message,
                      type: 'warning' 
                  }
              )
            }
          } ).catch( err => {
            this.emitter?.emit( 
                'message',
                {
                    title: '移除產品發生錯誤', 
                    message: err.response?.data.message, 
                    type: 'danger' 
                }
            )
          } )
      }
    },
    created () { this.getProducts() },
    data () {
      return {
        products: [],
        product: {},
        pagination: {},
        isLoading: false
      }
    },
  }
</script>