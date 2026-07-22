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
    <Modal ref="articleModal" :title="`${article.id ? '編輯' : '新增'}文章`">
        <LoadingC :is-full-page="false" :active="isLoading" />
        <FormC ref="form" v-slot="{ errors }" @submit="addEditArticle" :initial-values="article" :initial-errors="{}">
            <div class="modal-body container">
                <div class="row py-1">
                    <div class="col-4 col-sm-3">
                        <label for="title">標題</label>
                    </div>
                    <div class="col-8 col-sm-9">
                        <FieldC label="標題" name="title" class="form-control" id="title" type="text" rules="required" v-model="article.title" v-bind:class="{ 'is-invalid': errors['title'] }" />
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
                                <FieldC label="網址" name="url" rules="url" type="text" class="form-control" id="image" aria-describedby="addImage" placeholder="請輸入圖片連結"
                                        v-model="tempUrl" :standalone="true" v-bind:class="{ 'is-invalid': errors['url'] }" />
                                <button id="addImage" type="button" class="btn btn-outline-primary btn-sm"
                                        @click="saveImage(tempUrl)" v-bind:disabled="!tempUrl">
                                    新增圖片
                                </button>
                            </div>
                            <ErrorMessage class="invalid-feedback" name="url" />
                        </div>
                        <div class="mb-3">
                            <label for="input" class="form-label">或上傳圖片</label>
                            <FieldC class="form-control" name="file" type="file" rules="image" label="選取檔案"
                                    @change="event=>saveImage(event.target.files[0])" v-bind:class="{ 'is-invalid': errors['file'] }" :standalone="true" />
                            <ErrorMessage name="file" class="invalid-feedback" :style="{'display': errors['file'] ? 'block' : 'none' }" />
                        </div>
                        <div class="input-group">
                            <input type="url" readonly :value="article.image" class="form-control" />
                            <input type="button" value="刪除" class="btn btn-outline-danger btn-sm" @click="()=>{delete article.image}" />
                        </div>
                    </div>
                </div>
                <div class="row py-1">
                    <div class="col-4 col-sm-3">
                        <label for="tag">標籤</label>
                    </div>
                    <div class="col-8 col-sm-9">
                        <p v-if="Array.isArray(article.tag)">
                            <span class="badge rounded-pill bg-secondary" v-for="tag in article.tag" :key="tag">
                                {{ tag }}
                                <button type="button" class="btn-close" aria-label="Close" @click="removeTag(tag)"></button>
                            </span>
                        </p>
                        <p class="input-group">
                            <input class="form-control" id="tag" type="text" v-model="tempTag" />
                            <button type="button" class="btn btn-outline-primary" @click="addTag(tempTag)" v-bind:disabled="!tempTag">新增</button>
                        </p>
                    </div>
                </div>
                <div class="row py-1">
                    <div class="col-4 col-sm-3">
                        <label for="description">描述</label>
                    </div>
                    <div class="col-8 col-sm-9">
                        <textarea class="form-control" id="description" rows="2" cols="40" v-model="article.description" />
                    </div>
                </div>
                <div class="row py-1">
                    <div class="col-4 col-sm-3">
                        <label for="content">內容</label>
                    </div>
                    <div class="col-8 col-sm-9">
                        <FieldC label="內容" as="textarea" name="content" class="form-control" id="content" rows="2" cols="40" rules="required"
                                v-model="article.content" v-bind:class="{ 'is-invalid': errors['content'] }" />
                        <ErrorMessage class="invalid-feedback" name="content" />
                    </div>
                </div>
                <div class="row py-1">
                    <div class="col-4 col-sm-3">
                        <label for="author">作者</label>
                    </div>
                    <div class="col-8 col-sm-9">
                        <FieldC label="作者" name="author" class="form-control" id="author" type="text" rules="required"
                                v-model="article.author" v-bind:class="{ 'is-invalid': errors['author'] }" />
                        <ErrorMessage class="invalid-feedback" name="author" />
                    </div>
                </div>
                <div class="row pt-1">
                    <div class="col-4 col-sm-3">
                        <label class="form-check-label" for="public">是否公開</label>
                    </div>
                    <div class="col-8 col-sm-9 col-lg-1">
                        <FieldC class="form-check-input" id="public" type="checkbox" name="isPublic" label="是否公開"
                               :checked="article.isPublic" v-bind:class="{ 'is-invalid': errors['isPublic'] }" />
                    </div>
                    <div class="col-4 col-sm-3">
                        <label for="date">建立日期</label>
                    </div>
                    <div class="col-8 col-sm-9 col-lg-5">
                        <FieldC label="建立日期" name="date" class="form-control" id="date" type="date" rules="required"
                                v-model="article.create_at" v-bind:class="{ 'is-invalid': errors['date'] }" />
                        <ErrorMessage class="invalid-feedback" name="date" />
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <input type="submit" class="btn btn-primary" value="確定" />
                <input type="reset" class="btn btn-secondary" value="取消" @click="$refs.articleModal.hideModal()" />
            </div>
        </FormC>
    </Modal>
    <Modal ref="removeModal" title="移除文章">
        <div class="modal-body">
            <p>您要移除{{ article?.title }}嗎？</p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="$refs.removeModal.hideModal()">取消</button>
            <button type="button" class="btn btn-danger" @click="removeArticle">確定</button>
        </div>
    </Modal>
</template>
<script>
    import {addImage, uploadImage} from '@/util'
    import Pagination from '@/components/PaginationBar.vue';
    import Modal from '@/components/ModalComponent.vue';
    export default {
        name: 'ArticleManage',
        inject: ['emitter'],
        components: {
            Modal,
            Pagination,
        },
        methods: {
            addEditArticle (tempArticle) {
                this.article = {
                    ...tempArticle,
                    create_at: new Date(tempArticle.create_at).getTime()
                };
                const type = this.article.id ? 'put' : 'post';
                const api = this.article.id ? `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/article/${this.article.id}` : `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/article`;
                this.$http[type](
                    api,
                    {
                        data: this.article
                    }).then(response => {
                        if (response.data.success) {
                            this.emitter.emit(
                                'message',
                                {
                                    type: 'success',
                                    title: this.article.id ? '文章編輯成功' : '文章新增成功',
                                    content: this.article.id ? '文章已更新' : '文章已新增'
                                }
                            );
                            this.$refs.articleModal.hideModal();
                            this.getArticles();
                        } else {
                            this.emitter.emit(
                                'message',
                                {
                                    type: 'warning',
                                    title: this.article.id ? '文章編輯失敗' : '文章新增失敗',
                                    content: response.data.message
                                }
                            );
                        }
                    }).catch(error => {
                        this.emitter.emit(
                            'message',
                            {
                                type: 'danger',
                                title: this.article.id ? '文章編輯發生錯誤' : '文章新增發生錯誤',
                                content: error
                            }
                        );
                    });
            },
            getArticle (id) {
                this.isLoading = true;
                this.$http.get(
                    `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/article/${id}`
                ).then(response => {
                    if (response.data.success) {
                        this.article = response.data.article
                        this.article.create_at = this.$filters.transDate(response.data.article.create_at)
                    } else {
                        this.emitter.emit(
                            'message',
                            {
                                type: 'warning',
                                title: '取得文章失敗',
                                content: response.data.message
                            }
                        )
                        this.article.create_at = this.$filters.transDate(Date.now())
                    }
                }).catch(error => {
                    this.emitter.emit(
                        'message',
                        {
                            type: 'danger',
                            title: '取得文章發生錯誤',
                            content: error.response?.data.message
                        }
                    )
                    this.article.create_at = this.$filters.transDate(Date.now())    
                }).finally(() => {
                    this.isLoading = false;
                });
            },
            getArticles (page = 1) {
                this.isLoading = true;
                this.$http.get(
                    `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/articles`,
                    {params: {page}}
                ).then(response => {
                    this.articles = response.data.articles;
                    this.pagination = response.data.pagination;
                }).catch(error => {
                    this.emitter.emit(
                        'message', {
                        type: 'warning',
                        title: '取得文章列表失敗',
                        content: error.response.data.message
                    });
                }).finally(() => {
                    this.isLoading = false;
                });
            },
            openModal (action, id) {
                if (action === 'add') {
                    this.article.create_at = this.$filters.transDate(Date.now())
                    this.$refs.articleModal.showModal()
                } else if (action === 'edit') {
                    this.getArticle(id)
                    this.$refs.articleModal.showModal()
                } else if (action === 'remove') {
                    this.getArticle(id)
                    this.$refs.removeModal.showModal()
                }
            },
            removeArticle () {
                this.$http.delete(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/article/${this.article.id}`)
                    .then(({data}) => {
                        if (data.success) {
                            this.emitter.emit('message', {type: 'success', title: '移除文章成功', content: data.message});
                            this.$refs.removeModal.hideModal();
                            this.getArticles();
                        } else {
                            this.emitter.emit('message', {type: 'warning', title: '移除文章失敗', content: data.message});
                        }
                    }).catch(err => {
                        this.emitter.emit('message', {type: 'danger', title: '移除文章發生錯誤', content: err});
                    })
            },
            saveImage (file) {uploadImage(file, url => this.article.image = url)},
            saveUrl (url) {addImage(url, url => this.article.image = url)}
        },
        data () {
            return {
                isLoading: false,
                articles: [],
                article: {},
                pagination: {},
                tempUrl: '',
                tempTag: ''
            }
        },
        mounted () {
            this.getArticles();
        }
    };
</script>