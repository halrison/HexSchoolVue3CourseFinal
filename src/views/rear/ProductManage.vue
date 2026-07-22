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
        <Modal ref="productModal" size="xl" :title="`${ product.id ? '編輯' : '新增' }產品`">
            <FormC class="modal-content border-0"
                   v-slot="{ errors }" ref="form"
                   @submit="addEditProduct"
                   :initial-values="product" :initial-errors="{}">
                <div class="modal-body">
                    <div class="row">
                        <div class="col-xl-4">
                            <div>
                                <label for="image" class="form-label">輸入圖片網址</label>
                                <br />
                                <p class="mb-3 input-group">
                                    <FieldC label="圖片網址" name="url" rules="url" type="text" class="form-control" id="image" aria-describedby="addImage" placeholder="請輸入圖片連結"
                                            v-model="tempUrl" v-bind:class="{ 'is-invalid': errors['url'] }" :standalone="true" />
                                    <button id="addImage" type="button" class="btn btn-outline-primary btn-sm"
                                            @click="saveImage(tempUrl, url => saveUrl(url))" v-bind:disabled="!tempUrl">
                                        新增圖片
                                    </button>
                                </p>
                                <ErrorMessage class="invalid-feedback" name="url" />
                            </div>
                            <div class="mb-3">
                                <label for="input" class="form-label">或上傳圖片</label>
                                <FieldC class="form-control" name="file" type="file" label="選取檔案"
                                        @change="event => saveImage(event.target.files[0])" :standalone="true" v-bind:class="{ 'is-invalid': errors.file }" />
                                <ErrorMessage name="file" class="invalid-feedback" :style="{ 'display': errors.file ? 'block' : 'none' }" />
                            </div>
                            <div class="mt-5 mb-3 input-group">
                                <div class="mb-3 input-group" v-show="product.imageUrl">
                                    主圖片
                                    <input type="url" class="form-control ms-1" readonly placeholder="請輸入連結"
                                           :value="product.imageUrl" />
                                    <button type="button" class="btn btn-outline-danger" @click="delete tempProduct.imageUrl">
                                        移除
                                    </button>
                                </div>
                                <div class="mb-3 input-group" v-for="url,index in product.imagesUrl" :key="index">
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
                                <FieldC type="text" class="form-control col-9" id="title" label="標題" name="title" placeholder="請輸入標題"
                                        v-model="product.title" v-bind:class="{ 'is-invalid': errors.title }" />
                                <ErrorMessage class="invalid-feedback" name="title" />
                            </div>
                            <div class="row gx-2">
                                <div class="mb-3 col-6">
                                    <label for="category" class="form-label">分類</label>
                                    <FieldC type="text" class="form-control" id="category" placeholder="請輸入分類" label="分類" name="category"
                                            v-model="product.category" v-bind:class="{ 'is-invalid': errors.category }" />
                                    <ErrorMessage class="invalid-feedback" name="category" />
                                </div>
                                <div class="mb-3 col-6">
                                    <label for="price" class="form-label">單位</label>
                                    <FieldC type="text" class="form-control" id="unit" label="單位" name="unit" placeholder="請輸入單位"
                                            v-model="product.unit" v-bind:class="{ 'is-invalid': errors.unit }" />
                                    <ErrorMessage class="invalid-feedback" name="unit" />
                                </div>
                            </div>
                            <div class="row gx-2">
                                <div class="mb-3 col-6">
                                    <label for="origin_price" class="form-label">原價</label>
                                    <FieldC type="number" class="form-control" id="origin_price" min="1" rules="integer" placeholder="請輸入原價" label="原價" name="origin_price"
                                            v-model="product.origin_price" v-bind:class="{ 'is-invalid': errors.origin_price }" />
                                    <ErrorMessage class="invalid-feedback" name="origin_price" />
                                </div>
                                <div class="mb-3 col-6">
                                    <label for="price" class="form-label">售價</label>
                                    <FieldC type="number" class="form-control" id="price" min="1" label="售價" name="price" rules="integer" placeholder="請輸入售價"
                                            v-model="product.price" :max="product.price" v-bind:class="{ 'is-invalid': errors.price }" />
                                    <ErrorMessage class="invalid-feedback" name="price" />
                                </div>
                            </div>
                            <hr>
                            <div class="mb-3">
                                <label for="description" class="form-label">產品描述</label>
                                <FieldC name="description" class="form-control" id="description" placeholder="請輸入產品描述"
                                        v-model="product.description" as="textarea" />
                            </div>
                            <div class="mb-3">
                                <label for="content" class="form-label">說明內容</label>
                                <FieldC name="content" class="form-control" id="content" placeholder="請輸入產品說明內容"
                                        v-model="product.content" as="textarea" />
                            </div>
                            <div class="mb-3">
                                <div class="form-check">
                                    <FieldC type="checkbox" class="form-check-input" id="is_enabled" name="is_enabled"
                                            :checked="product.is_enabled" :true-value="1" :false-value="0" />
                                    <label class="form-check-label" for="is_enabled">
                                        是否啟用
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <input type="submit" class="btn btn-primary" value="確認" />
                    <input type="button" class="btn btn-secondary" @click="$refs.productModal.hideModal()" value="取消" />
                </div>
            </FormC>
        </Modal>
        <Modal title="刪除商品" ref="removeModal">
            <div class="modal-body">
                <p>您要移除{{ product?.title }}嗎？</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="$refs.removeModal.hideModal()">取消</button>
                <button type="button" class="btn btn-danger" @click="removeProduct">確定</button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import Pagination from '@/components/PaginationBar.vue'
    import Modal from '@/components/ModalComponent.vue'
    import {addImage, uploadImage} from '@/util'
    export default {
        name: 'ProductManage',
        components: {Pagination, Modal},
        inject: ['emitter'],
        methods: {
            addEditProduct (tempProduct) {
                this.product = tempProduct
                const type = this.product.id ? 'put' : 'post'
                const api = this.product.id ? `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/product/${this.product.id}` : `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/product`
                this.$http[type](
                    api,
                    {data: this.product}
                ).then(res => {
                    if (res.data.success) {
                        this.$refs.productModal.hideModal()
                        this.emitter.emit(
                            'message',
                            {
                                type: 'success',
                                title: `${type === 'put' ? '變更' : '新增'}產品成功`,
                                content: res.data.message
                            }
                        )
                        this.getProducts()
                    } else {
                        this.emitter.emit(
                            'message',
                            {
                                type: 'warning',
                                title: `${type === 'put' ? '變更' : '新增'}產品失敗`,
                                content: res.data.message
                            }
                        )
                    }
                }).catch(err => {
                    err.response.data.message.forEach(msg => {
                        this.emitter.emit(
                            'message',
                            {
                                type: 'danger',
                                title: `${type === 'put' ? '變更' : '新增'}產品發生錯誤`,
                                content: msg
                            }
                        )
                    })
                })
            },
            getProducts (page = 1) {
                this.isLoading = true
                this.$http.get(
                    `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/products`,
                    {
                        params: {page}
                    }).then(res => {
                        if (res.data.success) {
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
                    }).catch(err => {
                        this.emitter.emit(
                            'message',
                            {
                                type: 'danger',
                                title: '取得產品列表失敗',
                                content: err.response.data.message
                            }
                        )
                    }).finally(() => {this.isLoading = false})
            },
            openModal (action, item) {
                switch (action) {
                    case 'add':
                        this.product = {}
                        this.$refs.productModal.showModal()
                        break
                    case 'modify':
                        this.product = item
                        this.$refs.productModal.showModal()
                        break
                    case 'remove':
                        this.product = item
                        this.$refs.removeModal.showModal()
                        break
                }
            },
            removeProduct () {
                this.$http.delete(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/product/${this.product.id}`)
                    .then(({data}) => {
                        if (data.success) {
                            this.emitter?.emit(
                                'message',
                                {
                                    title: '移除產品成功',
                                    message: data.message,
                                    type: 'success'
                                }
                            )
                            this.$refs.removeModal.hideModal()
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
                    }).catch(err => {
                        this.emitter?.emit(
                            'message',
                            {
                                title: '移除產品發生錯誤',
                                message: err.response?.data.message,
                                type: 'danger'
                            }
                        )
                    })
            },
            saveUrl (url) {
                if (/^(https?:\/\/.*\.(?:png|jpg|jpeg))/i.test(url))
                    addImage(
                        url,
                        imgUrl => {
                            if (this.product.imageUrl) this.product.imagesUrl.push(imgUrl)
                            else this.product.imageUrl = imgUrl
                        }
                    )
                else this.$refs.form.setFieldError('url', '此網址並非圖片')
            },
            saveImage (file) {
                if (file?.size > 3145728) this.$refs.form.setFieldError('file', '檔案大小超過3MB')
                else if (['image/jpeg', 'image/png'].includes(file?.type)) uploadImage(
                    file,
                    url => {this.saveUrl(url)}
                )
                else this.$refs.form.setFieldError('file', '檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式。')
            }
        },
        created () {this.getProducts()},
        data () {
            return {
                products: [],
                product: {},
                pagination: {},
                isLoading: false,
                tempUrl: ''
            }
        }
    }
</script>