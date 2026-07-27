<template>
    <LoadingC :is-full-page="true" :active="isLoading" />
    <button type="button" class="float-end btn btn-outline-info mt-1" @click="openModal('add',{})">
        <i class="bi bi-plus"></i>
        新增文章
    </button>
    <div class="table-responsive-sm overflow-x-hidden mt-5">
        <table class="table table-striped">
            <thead>
                <tr class="row mx-0">
                    <th class="col-6 col-sm-8 col-lg-4">標題</th>
                    <th class="col-6 col-sm-4 col-lg-2">作者</th>
                    <th class="col-6 col-sm-4 col-lg-2">建立日期</th>
                    <th class="col-6 col-sm-2 col-lg-1">公開</th>
                    <th class="col-sm-6 col-lg-3 text-center">動作</th>
                </tr>
            </thead>
            <tbody>
                <tr class="row mx-0" v-for="article in articleStore.articles" :key="article.id">
                    <td class="col-6 col-sm-8 col-lg-4">{{ article.title }}</td>
                    <td class="col-6 col-sm-4 col-lg-2">{{ article.author }}</td>
                    <td class="col-6 col-sm-4 col-lg-2">{{ $filters.transDate(article.create_at) }}</td>
                    <td class="col-6 col-sm-2 col-lg-1"
                        v-bind:class="article.isPublic ? 'text-success' : 'text-danger'">
                        {{ article.isPublic ? '是' : '否' }}
                    </td>
                    <td class="col-sm-6 col-lg-3">
                        <div class="btn-group btn-group-sm w-100">
                            <button class="btn btn-outline-warning" @click="openModal('edit', article)">
                                <i class="bi bi-pencil-square"></i>
                                編輯
                            </button>
                            <button class="btn btn-outline-danger" @click="openModal('remove', article)">
                                <i class="bi bi-trash"></i>
                                移除
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <Pagination :pagination="articleStore.pagination" v-show="articleStore.pagination.total_pages > 1" @paginate="articleStore.getArticles" />
    <Modal :title="modalTitle" ref="ArticleModal">
        <template v-slot:body>
            <form id="articleForm" @submit="addEditArticle" @reset="ArticleModal.hideModal()">
                <div class="container">
                    <div class="row py-1">
                        <div class="col-4 col-sm-3">
                            <label for="title">標題</label>
                        </div>
                        <div class="col-8 col-sm-9">
                            <input class="form-control" type="text" v-model="title" id="title" />
                            <span class="invalid-feedback">{{errorBag.title}}</span>
                        </div>
                    </div>
                    <div class="row py-1">
                        <div class="col-4 col-sm-3">
                            <label for="image">圖片</label>
                        </div>
                        <div class="col-8 col-sm-9">
                            <div class="mb-3">
                                <label for="image" class="form-label">輸入圖片網址</label>
                                <br />
                                <div class="input-group">
                                    <input type="url" class="form-control" v-model="tempUrl.value.value" v-bind:class="{'is-invalid':tempUrl.errors.value.length}" />
                                    <input type="button" class="btn btn-outline-primary btn-sm" value="新增圖片"
                                           @click="saveUrl" v-bind:disabled="!tempUrl.value.value" />
                                </div>
                                <span class="invalid-feedback" v-bind:class="tempUrl.errors ? 'd-block' : 'd-none'">{{tempUrl.errorMessage}}</span>
                            </div>
                            <div class="mb-3">
                                <label for="input" class="form-label">或上傳圖片</label>
                                <input class="form-control" type="file" @change="saveImage" v-bind:class="{ 'is-invalid': tempFile.errors.value.length }" />
                                <span class="invalid-feedback" v-bind:class="tempFile.errors ? 'd-block' : 'd-none' ">{{tempFile.errorMessage}}</span>
                            </div>
                            <div class="input-group" v-show="articleStore.article.image">
                                <input type="url" readonly :value="articleStore.article.image" class="form-control" />
                                <input type="button" value="刪除" class="btn btn-outline-danger btn-sm" @click="()=>{delete articleStore.article.image}" />
                            </div>
                        </div>
                    </div>
                    <div class="row py-1">
                        <div class="col-4 col-sm-3">
                            <label for="tag">標籤</label>
                        </div>
                        <div class="col-8 col-sm-9">
                            <p v-if="Array.isArray(articleStore.article.tag)">
                                <span class="badge rounded-pill bg-secondary" v-for="tag in articleStore.article.tag" :key="tag">
                                    {{ tag }}
                                    <button type="button" class="btn-close" aria-label="Close" @click="removeTag(tag)"></button>
                                </span>
                            </p>
                            <p class="input-group">
                                <input class="form-control" id="tag" type="text" v-model="tempTag.value.value" />
                                <input type="button" class="btn btn-outline-primary" value="新增" @click="addTag(tempTag.value.value)" />
                            </p>
                        </div>
                    </div>
                    <div class="row py-1">
                        <div class="col-4 col-sm-3">
                            <label for="description">描述</label>
                        </div>
                        <div class="col-8 col-sm-9">
                            <textarea class="form-control" id="description" placeholder="請輸入文章描述" v-model="description"></textarea>
                        </div>
                    </div>
                    <div class="row py-1">
                        <div class="col-4 col-sm-3">
                            <label for="content">內容</label>
                        </div>
                        <div class="col-8 col-sm-9">
                            <textarea class="form-control" id="content" placeholder="請輸入文章內容" v-model="content"></textarea>
                        </div>
                    </div>
                    <div class="row py-1">
                        <div class="col-4 col-sm-3">
                            <label for="author">作者</label>
                        </div>
                        <div class="col-8 col-sm-9">
                            <input type="text" class="form-control" v-model="author" v-bind:class="{ 'is-invalid': errors['author'] }" />
                            <span class="invalid-feedback">{{errorBag.author}}</span>
                        </div>
                    </div>
                    <div class="row pt-1">
                        <div class="col-4 col-sm-3">
                            <label class="form-check-label" for="public">是否公開</label>
                        </div>
                        <div class="col-8 col-sm-9 col-lg-1">
                            <input class="form-check-input" id="public" type="checkbox"
                                   v-model="isPublic" />
                        </div>
                        <div class="col-4 col-sm-3">
                            <label for="date">建立日期</label>
                        </div>
                        <div class="col-8 col-sm-9 col-lg-5">
                            <input type="date" class="form-control" v-model="create_at" v-bind:class="{ 'is-invalid': errors['date'] }" />
                            <span class="invalid-feedback">{{errorBag.create_at}}</span>
                        </div>
                    </div>
                </div>
            </form>
        </template>
        <template v-slot:footer>
            <input type="submit" class="btn btn-primary" value="確定" form="articleForm" />
            <input type="reset" class="btn btn-secondary" value="取消" form="articleForm"/>
        </template>
    </Modal>
    <Modal title="刪除文章" ref="RemoveModal">
        <template v-slot:body>
            <p>{{modalTitle}}</p>
        </template>
        <template v-slot:footer>
            <button class="btn btn-secondary" type="button" @click="RemoveModal.hideModal()">取消</button>
            <button class="btn btn-danger" type="button" @click="removeArticle">確定</button>
        </template>
    </Modal>
</template>
<script setup>
    import {getCurrentInstance, inject, onMounted, ref, useTemplateRef} from 'vue'
    import {useField, useForm} from 'vee-validate'
    import useArticleStore from '@/stores/articles'
    import useLoadingStore from '@/stores/loading'
    import useMessageStore from '@/stores/messages'
    import Modal from '@/components/ModalComponent.vue'
    import Pagination from '@/components/PaginationBar.vue'
    const {proxy} = getCurrentInstance()
    const http = inject('http')
    const modalTitle = ref('')
    const ArticleModal = useTemplateRef('ArticleModal')
    const RemoveModal = useTemplateRef('RemoveModal')
    const isLoading = useLoadingStore()
    const messageStore = useMessageStore()
    const articleStore = useArticleStore()
    const {defineField, errors, errorBag, handleSubmit, resetForm, setValues} = useForm({
        initialValues: {
            author: "",
            create_at: proxy.$filters.transDate(Date.now()),
            description: "",
            content: "",
            isPublic: false,
            title: ""
        },
        initialErrors: {
            author: "",
            create_at: "",
            title: ""
        }
    })
    const [author] = defineField('author')
    const [create_at] = defineField('create_at')
    const [description] = defineField('description')
    const [content] = defineField('content')
    const [isPublic] = defineField('isPublic')
    const [title] = defineField('title')
    const tempFile = useField('tempIFile')
    const tempUrl = useField('tempUrl')
    const tempTag = useField('tempTag')
    const addEditArticle = handleSubmit(tempArticle => {
        Object.assign(
            articleStore.article,
            {
                ...tempArticle,
                create_at: new Date(tempArticle.create_at).getTime()
            }
        )
        const type = articleStore.article.id ? 'put' : 'post';
        const api = articleStore.article.id ? `/api/${import.meta.env.VITE_PATH}/admin/article/${articleStore.article.id}` : `/api/${import.meta.env.VITE_PATH}/admin/article`;
        http({
            method: type,
            url: api,
            data: {data: articleStore.article}
        }).then(response => {
            if (response.data.success) {
                ArticleModal.value.hideModal();
                messageStore.pushMessage({
                    type: 'success',
                    title: articleStore.article.id ? '文章編輯成功' : '文章新增成功',
                    content: response.data.message
                });
                articleStore.getArticles(1, 'admin')
            } else {
                messageStore.pushMessage({
                    type: 'warning',
                    title: articleStore.article.id ? '文章編輯失敗' : '文章新增失敗',
                    content: response.data.message
                });
            }
        }).catch(error => {
            messageStore.pushMessage({
                type: 'danger',
                title: articleStore.article.id ? '文章編輯失敗' : '文章新增失敗',
                content: error.response?.data.message
            });
        })
    })
    const openModal = async (action, item) => {
        tempFile.setErrors('')
        tempUrl.setErrors('')
        tempTag.setErrors('')
        if (action === 'add') {
            Object.assign(
                articleStore.article,
                {
                    title: '',
                    image: '',
                    tag: [],
                    description: '',
                    content: '',
                    create_at: proxy.$filters.transDate(Date.now())
                }
            )
            resetForm()
            modalTitle.value = '新增文章'
            ArticleModal.value.showModal();
        } else if (action === 'edit') {
            Object.assign(
                articleStore.article,
                {
                    ...item,
                    create_at: proxy.$filters.transDate(item.create_at)
                }
            )
            const response = await articleStore.getArticle(item.id, 'admin')
            if (response?.data?.success) {
                setValues({
                    ...articleStore.article,
                    create_at: proxy.$filters.transDate(articleStore.article.create_at)
                })
                modalTitle.value = '編輯文章'
                ArticleModal.value.showModal()
            }
        } else if (action === 'remove') {
            Object.assign(articleStore.article, item)
            modalTitle.value = `要刪除文章 ${articleStore.article.title} 嗎`
            RemoveModal.value.showModal()
        }
    }
    const removeArticle = () => {
        http({
            url: `/api/${import.meta.env.VITE_PATH}/admin/article/${articleStore.article.id}`,
            method: 'delete'
        }).then(({data}) => {
            if (data.success) {
                messageStore.pushMessage({
                    title: '移除文章成功',
                    message: data.message,
                    type: 'success'
                })
                RemoveModal.value.hideModal()
            } else {
                messageStore.pushMessage({
                    title: '移除文章失敗',
                    message: data.message,
                    type: 'warning'
                })
            }
        }).catch(err => {
            messageStore.pushMessage({
                title: '移除文章發生錯誤',
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
                url => {saveUrl(url)}
            )
        } else tempFile.setErrors('檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式。')
    }
    const saveUrl = () => {
        if (/^(https?:\/\/.*\.(?:png|jpg|jpeg))/i.test(tempUrl.value.value)) {
            addImage(
                tempUrl.value.value,
                img => {
                    articleStore.article.image = img
                })
        }
        else tempUrl.setErrors('此網址並非圖片')
    }
    onMounted(() => {
        articleStore.getArticles(1, 'admin')
    })
</script>