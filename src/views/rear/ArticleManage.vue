<template>
    <LoadingC :is-full-page="true" :active="isLoading" />
    <button type="button" class="float-end btn btn-outline-info mt-1" @click="openModal('add')">
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
                <tr class="row mx-0" v-for="article in articles" :key="article.id">
                    <td class="col-6 col-sm-8 col-lg-4">{{ article.title }}</td>
                    <td class="col-6 col-sm-4 col-lg-2">{{ article.author }}</td>
                    <td class="col-6 col-sm-4 col-lg-2">{{ $filters.transDate(article.create_at) }}</td>
                    <td class="col-6 col-sm-2 col-lg-1"
                        v-bind:class="article.isPublic ? 'text-success' : 'text-danger'">
                        {{ article.isPublic ? '是' : '否' }}
                    </td>
                    <td class="col-sm-6 col-lg-3">
                        <div class="btn-group btn-group-sm w-100">
                            <button class="btn btn-outline-warning" @click="openModal('edit', article.id)">
                                <i class="bi bi-pencil-square"></i>
                                編輯
                            </button>
                            <button class="btn btn-outline-danger" @click="openModal('remove', article.id)">
                                <i class="bi bi-trash"></i>
                                移除
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <Pagination :pagination="pagination" v-show="pagination.total_pages > 1" @paginate="getArticles" />
    <Modal :title="modalTitle" size="lg" ref="AddEditModal">
        <LoadingC :is-full-page="false" :active="isLoading" />
        <div class="modal-dialog" role="dialog">
            <FormC class="modal-content"
                   ref="form" v-slot="{ errors }"
                   @submit="addEditArticle" @reset="$refs.AddEditModal.hideModal()"
                   :initial-values="tempArticle" :initial-errors="error">
                   <div class="modal-header">
                       <h5 class="modal-title">{{ modalTitle }}</h5>
                    </div>
                <div class="modal-body container">
                    <div class="row py-1">
                        <div class="col-4 col-sm-3">
                            <label for="title">標題</label>
                        </div>
                        <div class="col-8 col-sm-9">
                            <FieldC label="此欄位" name="title" class="form-control" id="title" type="text" rules="required" v-model="tempArticle.title" v-bind:class="{ 'is-invalid': errors['title'] }" />
                            <ErrorMessage class="invalid-feedback" name="title" />
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
                                    <FieldC label="此欄位" name="url" rules="url" type="text" class="form-control" id="image" aria-describedby="addImage" placeholder="請輸入圖片連結"
                                            v-model="tempUrl" :standalone="true" v-bind:class="{ 'is-invalid': errors['url'] }" />
                                    <button id="addImage" type="button" class="btn btn-outline-primary btn-sm"
                                            @click="addImage(tempUrl,url=>tempArticle.image=url)" v-bind:disabled="!tempUrl">
                                        新增圖片
                                    </button>
                                </div>
                                <ErrorMessage class="invalid-feedback" name="url" />
                            </div>
                            <div class="mb-3">
                                <label for="input" class="form-label">或上傳圖片</label>
                                <FieldC class="form-control" name="file" type="file" rules="image" label="此欄位"
                                        @change="event=>UploadImage(event.target.files[0], url=>tempUrl=url)" v-bind:class="{ 'is-invalid': errors['file'] }" :standalone="true" />
                                <ErrorMessage name="file" class="invalid-feedback" :style="{'display': errors['file'] ? 'block' : 'none' }" />
                            </div>
                            <div class="input-group">
                                <input type="url" readonly :value="tempArticle.image" class="form-control" />
                                <input type="button" value="刪除" class="btn btn-outline-danger btn-sm" @click="()=>{delete tempArticle.image}" />
                            </div>
                        </div>
                    </div>
                    <div class="row py-1">
                        <div class="col-4 col-sm-3">
                            <label for="tag">標籤</label>
                        </div>
                        <div class="col-8 col-sm-9">
                            <p v-if="Array.isArray(tempArticle.tag)">
                                <span class="badge rounded-pill bg-secondary" v-for="tag in tempArticle.tag" :key="tag">
                                    {{ tag }}
                                    <button type="button" class="btn-close" aria-label="Close" @click="removeTag(tag)"></button>
                                </span>
                            </p>
                            <p class="input-group">
                                <input class="form-control" id="tag" type="text" v-model="tempTag" />
                                <button type="button" class="btn btn-outline-primary" @click="addTag(tempTag)">新增</button>
                            </p>
                        </div>
                    </div>
                    <div class="row py-1">
                        <div class="col-4 col-sm-3">
                            <label for="description">描述</label>
                        </div>
                        <div class="col-8 col-sm-9">
                            <FieldC label="此欄位" as="textarea" name="description" class="form-control" id="description" rows="2" cols="40"
                                    v-bind:class="{ 'is-invalid': errors['description'] }" />
                            <ErrorMessage class="invalid-feedback" name="description" />
                        </div>
                    </div>
                    <div class="row py-1">
                        <div class="col-4 col-sm-3">
                            <label for="content">內容</label>
                        </div>
                        <div class="col-8 col-sm-9">
                            <FieldC label="此欄位" as="textarea" name="content" class="form-control" id="content" rows="2" cols="40"
                                    v-bind:class="{ 'is-invalid': errors['content'] }" />
                            <ErrorMessage class="invalid-feedback" name="content" />
                        </div>
                    </div>
                    <div class="row py-1">
                        <div class="col-4 col-sm-3">
                            <label for="author">作者</label>
                        </div>
                        <div class="col-8 col-sm-9">
                            <FieldC label="此欄位" name="author" class="form-control" id="author" type="text"
                                    v-bind:class="{ 'is-invalid': errors['author'] }" />
                            <ErrorMessage class="invalid-feedback" name="author" />
                        </div>
                    </div>
                    <div class="row pt-1">
                        <div class="col-4 col-sm-3">
                            <label class="form-check-label" for="public">是否公開</label>
                        </div>
                        <div class="col-8 col-sm-9 col-lg-1">
                            <FieldC label="此欄位" name="isPublic" as="input" type="checkbox" />
                        </div>
                        <div class="col-4 col-sm-3">
                            <label for="date">建立日期</label>
                        </div>
                        <div class="col-8 col-sm-9 col-lg-5">
                            <FieldC label="此欄位" name="date" class="form-control" id="date" type="date" rules="required"
                                     v-bind:class="{ 'is-invalid': errors['date'] }" />
                            <ErrorMessage class="invalid-feedback" name="date" />
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary">確定</button>
                    <button type="reset" class="btn btn-secondary">取消</button>
                </div>
            </FormC>
        </div>
    </Modal>
    <Modal size="sm" ref="RemoveModal">
        <div class="modal-header">
            <h5 class="modal-title">刪除文章</h5>
        </div>
        <div class="modal-body">
            <p>您要{{modalTitle}}嗎？</p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-danger" @click="removeArticle(article.id)">確認</button>
            <button type="button" class="btn btn-secondary" @click="$refs.RemoveModal.hideModal()">取消</button>
        </div>
    </Modal>
</template>
<script>
    import Modal from '@/components/ModalComponent.vue'
    import Pagination from '@/components/PaginationBar.vue'
    export default {
        name: 'ArticleManage',
        inject: ['emitter'],
        components: {
            Pagination,
            Modal
        },
        data () {
            return {
                isLoading: false,
                articles: [],
                article: {},
                pagination: {},
                modalTitle: ''
            }
        },
        methods: {
            addEditArticle (tempArticle) {
                this.article = {
                    ...tempArticle,
                    create_at: new Date(tempArticle.create_at).getTime()
                }
                const type = this.article.id ? 'put' : 'post'
                const api = this.article.id ? `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/article/${this.article.id}` : `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/article`
                this.$http[type](
                    api,
                    {data: this.article}
                ).then(response => {
                    if (response.data.success) {
                        this.emitter.emit(
                            'message',
                            {
                                type: 'success',
                                title: this.article.id ? '文章編輯成功' : '文章新增成功',
                                content: response.data.message
                            }
                        )
                        this.$refs.AddEditModal.hideModal()
                    } else {
                        this.emitter.emit(
                            'message',
                            {
                                type: 'warning',
                                title: this.article.id ? '文章編輯失敗' : '文章新增失敗',
                                content: response.data.message
                            }
                        )
                    }
                }).catch(error => {
                    this.emitter.emit(
                        'message',
                        {
                            type: 'danger',
                            title: this.article.id ? '文章編輯發生錯誤' : '文章新增發生錯誤',
                            content: error.response?.data.message
                        }
                    )
                }).finally(() => {
                    this.getArticles()
                })
            },
            getArticles (page = 1) {
                this.isLoading = true
                this.$http.get(
                    `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/articles`,
                    {params: {page}}
                ).then(response => {
                    if (response.data.success) {
                        this.articles = response.data.articles
                        this.pagination = response.data.pagination
                    } else {
                        this.emitter.emit(
                            'message',
                            {
                                type: 'warning',
                                title: '取得文章列表失敗',
                                content: response.data.message
                            }
                        )
                    }
                }).catch(error => {
                    this.emitter.emit(
                        'message',
                        {
                            type: 'warning',
                            title: '取得文章列表失敗',
                            content: error.response?.data.message
                        }
                    )
                }).finally(() => {
                    this.isLoading = false
                })
            },
            openModal (action, id) {                
                if (action === 'add') {
                    this.modalTitle = '新增文章'
                    this.$refs.AddEditModal.showModal()
                } else if (action === 'edit') {
                    this.article.id=id
                    this.modalTitle = '編輯文章'
                    this.$refs.AddEditModal.showModal()
                } else if (action === 'remove') { 
                    this.article.id=id
                    this.modalTitle = `刪除${this.article.title}`
                    this.$refs.RemoveModal.showModal()
                }
            },
            removeArticle (id) {
                this.$http.delete(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/article/${id}`)
                    .then(({data}) => {
                        if (data.success) {
                            this.emitter?.emit(
                                'message',
                                {
                                    title: '移除文章成功',
                                    message: data.message,
                                    type: 'success'
                                }
                            )
                            this.$refs.RemoveModal.hideModal()
                        } else {
                            this.emitter?.emit(
                                'message',
                                {
                                    title: '移除文章失敗',
                                    message: data.message,
                                    type: 'warning'
                                }
                            )
                        }
                    }).catch(err => {
                        this.emitter?.emit(
                            'message',
                            {
                                title: '移除文章發生錯誤',
                                message: err.response?.data.message,
                                type: 'danger'
                            }
                        )
                    })
            }
        },
        watch: {
            'article.id' (newId) {
                if (newId) {
                    this.isLoading = true;
                    this.$http.get(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/article/${newId}`)
                        .then(response => {
                            if (response.data.success) {
                                this.tempArticle = {
                                    ...response.data.article,
                                    create_at: this.$filters.transDate(response.data.article.create_at)
                                };
                            } else {
                                this.emitter.emit(
                                    'message',
                                    {
                                        type: 'warning',
                                        title: '取得文章失敗',
                                        content: response.data.message
                                    }
                                )
                                this.$refs.form.resetForm()
                            }
                        })
                        .catch(err => {
                            this.emitter.emit(
                                'message',
                                {
                                    type: 'danger',
                                    title: '取得文章失敗',
                                    content: err
                                }
                            )
                            this.$refs.form.resetForm()
                        })
                        .finally(() => {
                            this.tempTag = ""
                            this.isLoading = false
                        });
                } else {
                    this.tempArticle = {
                        title: "",
                        image: "",
                        tag: [],
                        description: "",
                        content: "",
                        create_at: this.$filters.transDate(Date.now())
                    }
                    this.tempUrl = ""
                    this.error = {}
                    this.$refs.form.resetForm()
                }
            }
        },
        computed: {
            schema(){
                return{
                    author: 'required',
                    title: 'required',
                    create_at(value) {
                        if (!value) return '此欄位為必填'
                        else if (!this.article.id && this.$filters.transDate(value) < this.$filters.transDate(Date.now())) return '不得比今天還早'
                        else return true
                    }
                }
            }
        },
        mounted () {
            this.getArticles()
        }
    }
</script>