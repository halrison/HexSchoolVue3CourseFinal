<template>
    <div class="container">
        <div class="d-flex justify-content-end me-1">
            <button type="button" class="btn btn-outline-info mt-2" @click="openModal('add',{})">
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
                    <tr class="row mx-0" v-for="product in productStore.products" :key="product.id">
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
        <Pagination :pagination="productStore.pagination" v-show="productStore.pagination.total_pages > 1" @paginate="productStore.getProducts" />
        <Modal ref="productModal" size="xl" :title="modalTitle">
            <template v-slot:body>
                <form class="row" id="productForm" @submit="addEditProduct" @reset="productModal.hideModal()">
                    <div class="col-xl-4">
                        <p>
                            <label for="image" class="form-label">輸入圖片網址</label>
                            <br />
                            <div class="mb-3 input-group">
                                <input type="url" class="form-control" placeholder="請輸入圖片連結" v-model="tempUrl.value.value" v-bind:class="{'is-invalid':tempUrl.errors.value.length}" />
                                <input type="button" value="新增圖片" class="btn btn-outline-primary btn-sm" @click="saveUrl" v-bind:disabled="!tempUrl.value.value" />
                            </div>
                            <span class="invalid-feedback" v-bind:class="tempUrl.errors ? 'd-block' : 'd-none'">{{tempUrl.errorMessage}}</span>
                        </p>
                        <div class="mb-3">
                            <label for="input" class="form-label">或上傳圖片</label>
                            <input type="file" class="form-control" @change="saveImage" v-bind:class="{'is-invalid':tempFile.errors.value.length}" />
                            <span class="invalid-feedback" v-bind:class="tempFile.errors ? 'd-block' : 'd-none'">{{tempFile.errorMessage}}</span>
                        </div>
                        <div class="mt-5 mb-3 input-group">
                            <div class="mb-3 input-group" v-show="productStore.product.imageUrl">
                                主圖片
                                <input type="url" class="form-control ms-1" readonly placeholder="請輸入連結"
                                       :value="productStore.product.imageUrl" />
                                <button type="button" class="btn btn-outline-danger" @click="delete productStore.product.imageUrl">
                                    移除
                                </button>
                            </div>
                            <div class="mb-3 input-group" v-for="(url,index) in productStore.product.imagesUrl" :key="index">
                                副圖片{{ index + 1 }}
                                <input type="url" class="form-control ms-1" readonly placeholder="請輸入連結"
                                       :value="url" />
                                <button type="button" class="btn btn-outline-danger" @click="productStore.product.imagesUrl.splice(index, 1)">
                                    移除
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-8">
                        <div class="row gx-2 mb-3">
                            <label for="title" class="form-label col-3">標題</label>
                            <input id="title" type="text" class="form-control col-9" v-bind:class="{ 'is-invalid': errors['title'] }" v-model="title" />
                            <span class="invalid-feedback">{{errorBag.title}}</span>
                        </div>
                        <div class="row gx-2">
                            <div class="mb-3 col-6">
                                <label for="category" class="form-label">分類</label>
                                <input id="category" type="text" class="form-control" v-bind:class="{ 'is-invalid': errors['category'] }" v-model="category" />
                                <span class="invalid-feedback">{{errorBag.category}}</span>
                            </div>
                            <div class="mb-3 col-6">
                                <label for="price" class="form-label">單位</label>
                                <input id="unit" type="text" class="form-control" v-bind:class="{ 'is-invalid': errors['unit'] }" v-model="unit" />
                                <span class="invalid-feedback">{{errorBag.unit}}</span>
                            </div>
                        </div>
                        <div class="row gx-2">
                            <div class="mb-3 col-6">
                                <label for="origin_price" class="form-label">原價</label>
                                <input id="origin_price" type="number" class="form-control" v-bind:class="{ 'is-invalid': errors['origin_price'] }" v-model="origin_price" />
                                <span class="invalid-feedback">{{errorBag.origin_price}}</span>
                            </div>
                            <div class="mb-3 col-6">
                                <label for="price" class="form-label">售價</label>
                                <input id="price" type="number" class="form-control" v-bind:class="{ 'is-invalid': errors['price'] }" v-model="price" />
                                <span class="invalid-feedback">{{errorBag.price}}</span>
                            </div>
                        </div>
                        <hr>
                        <div class="mb-3">
                            <label for="description" class="form-label">產品描述</label>
                            <textarea class="form-control" id="description" placeholder="請輸入產品描述" v-model="description"></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="content" class="form-label">說明內容</label>
                            <textarea class="form-control" id="content" placeholder="請輸入產品說明內容" v-model="content"></textarea>
                        </div>
                        <div class="mb-3">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="is_enabled" v-bind:checked="is_enabled.checked"
                                       :value="is_enabled.value.value" />
                                <label class="form-check-label" for="is_enabled">
                                    是否啟用
                                </label>
                            </div>
                        </div>
                    </div>
                </form>
            </template>
            <template v-slot:footer>
                <input form="productForm" type="submit" class="btn btn-primary" value="確定" />
                <input form="productForm" type="reset" class="btn btn-secondary" value="取消" />
            </template>
        </Modal>
        <Modal ref="removeModal" size="sm" title="刪除產品">
            <template v-slot:body>
                <p>{{modalTitle}}</p>
            </template>
            <template v-slot:footer>
                <button type="button" class="btn btn-secondary" @click="removeModal.hideModal()">取消</button>
                <button type="button" class="btn btn-danger" @click="removeProduct">確定</button>
            </template>
        </Modal>
    </div>
</template>
<script setup>
    import {inject, onMounted, ref, useTemplateRef} from 'vue'
    import {useField, useForm} from 'vee-validate'
    import {addImage, uploadImage} from '@/util'
    import useLoadingStore from '@/stores/loading'
    import useMessageStore from '@/stores/messages'
    import useProductStore from '@/stores/products'
    import Pagination from '@/components/PaginationBar.vue'
    import Modal from '@/components/ModalComponent.vue'
    const modalTitle = ref('')
    const http = inject('http')
    const productModal = useTemplateRef('productModal')
    const removeModal = useTemplateRef('removeModal')
    const isLoading = useLoadingStore()
    const messageStore = useMessageStore()
    const productStore = useProductStore()
    const {defineField, errorBag, errors, handleSubmit, resetForm, setValues} = useForm({
        initialValues: {
            category: '',
            title: '',
            unit: '',
            origin_price: 0,
            price: 0,
            description: '',
            content: '',
        },
        initialErrors: {
            category: '',
            title: '',
            unit: '',
            origin_price: '',
            price: '',
        },
        validationSchema: {
            category: 'required',
            title: 'required',
            unit: 'required',
            origin_price: 'required|integer|min_value:0',
            price: 'required|integer|min_value:0',
        }
    })
    const tempUrl = useField('tempUrl', 'url')
    const tempFile = useField('tempFile', 'image')
    const is_enabled = useField(
        'is_enabled',
        undefined,
        {
            type: 'checkbox',
            syncVModel:true,
            checkedValue: 1,
            uncheckedValue: 0
        }
    )
    const [title] = defineField('title',{label:'此欄位'})
    const [unit] = defineField('unit',{label:'此欄位'})
    const [category] = defineField('category',{label:'此欄位'})
    const [origin_price] = defineField('origin_price',{label:'此欄位'})
    const [price] = defineField('price',{label:'此欄位'})
    const [description] = defineField('description')
    const [content] = defineField('content')
    const addEditProduct = handleSubmit(tempProduct => {
        const type = productStore.product.id ? 'put' : 'post'
        const api = productStore.product.id ? `/api/${import.meta.env.VITE_PATH}/admin/product/${productStore.product.id}` : `/api/${import.meta.env.VITE_PATH}/admin/product`
        http({
            method: type,
            url: api,
            data: {
                data: {
                    ...tempProduct,
                    is_enabled:is_enabled.value.value
                }
            }
        }).then(res => {
            if (res.data.success) {
                productModal.value.hideModal()
                messageStore.pushMessage({
                    type: 'success',
                    title: `${type === 'put' ? '變更' : '新增'}產品成功`,
                    content: res.data.message
                })
                productStore.getProducts(1, 'admin')
            } else {
                messageStore.pushMessage({
                    type: 'warning',
                    title: `${type === 'put' ? '變更' : '新增'}產品失敗`,
                    content: res.data.message
                })
            }
        }).catch(err => {
            err.response?.data.message.forEach(msg => {
                messageStore.pushMessage({
                    type: 'danger',
                    title: `${type === 'put' ? '變更' : '新增'}產品發生錯誤`,
                    content: msg
                })
            })
        })
    })
    const openModal = (action, item) => {
        Object.assign(productStore.product, item)
        tempFile.setErrors('')
        tempUrl.setErrors('')
        switch (action) {
            case 'add':
                modalTitle.value = '新增產品'
                resetForm()
                productModal.value.showModal()
                break
            case 'modify':
                modalTitle.value = '編輯產品'
                setValues(item)
                is_enabled.checked = !!item.is_enabled
                productModal.value.showModal()
                break
            case 'remove':
                modalTitle.value = `要刪除產品 ${productStore.product.title} 嗎 ?`
                removeModal.value.showModal()
                break
        }
    }
    const removeProduct = () => {
        http({
            url: `/api/${import.meta.env.VITE_PATH}/admin/product/${productStore.product.id}`,
            method: 'delete'
        }).then(({data}) => {
            if (data.success) {
                messageStore.pushMessage({
                    title: '移除成功',
                    message: data.message,
                    type: 'success'
                })
                removeModal.value.hideModal()
                productStore.getProducts(1, 'admin')
            } else {
                messageStore.pushMessage({
                    title: '移除失敗',
                    message: data.message,
                    type: 'warning'
                })
            }
        }).catch(err => {
            messageStore.pushMessage({
                title: '移除發生錯誤',
                message: err.response?.data.message,
                type: 'danger'
            })
        })
    }
    const saveImage = event => {
        const file = event.target.files[0]
        if (file?.size > 3145728) {
            tempFile.setErrors('檔案過大，上限 3 MB')
        } else if (['jpg', 'png'].includes(file?.ext)) {
            tempFile.setValue(file)
            uploadImage(
                tempFile.value.value,
                () => {saveUrl()}
            )
        } else tempFile.setErrors('檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式。')
    }
    const saveUrl = () => {
        if (/^(https?:\/\/.*\.(?:png|jpg|jpeg))/i.test(tempUrl.value.value)) {
            addImage(
                tempUrl.value.value,
                img => {
                    if (productStore.product.imageUrl) productStore.product.imagesUrl.push(img)
                    else productStore.product.imageUrl = img
                })
        }
        else tempUrl.setErrors('此網址並非圖片')
    }
    onMounted(() => {productStore.getProducts(1, 'admin')})
</script>