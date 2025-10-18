<template>
  <LoadingC :is-full-page="true" :active="isLoading" />
  <button type="button" class="float-end btn btn-primary mt-1" @click="openModal('add')">新增文章</button>
  <div class="table-responsive-sm overflow-x-hidden mt-5">
    <table class="table table-striped">
      <thead>
        <tr class="row mx-0">
          <th class="col-sm-8 col-lg-4">標題</th>
          <th class="col-sm-4 col-lg-2">作者</th>
          <th class="col-sm-4 col-lg-2">建立日期</th>
          <th class="col-sm-4 col-lg-1">公開</th>
          <th class="col-sm-4 col-lg-3">動作</th>
        </tr>
      </thead>
      <tbody>
        <tr class="row mx-0" v-for="article in articles" :key="article.id">
          <td class="col-sm-8 col-lg-4">{{ article.title }}</td>
          <td class="col-sm-4 col-lg-2">{{ article.author }}</td>
          <td class="col-sm-4 col-lg-2">{{ $filters.transDate(article.create_at) }}</td>
          <td class="col-sm-4 col-lg-1"
              v-bind:class="article.isPublic ? 'text-success' : 'text-danger'">
            {{ article.isPublic ? '是' : '否' }}
          </td>
          <td class="col-sm-4 col-lg-3">
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-primary" @click="openModal('edit', article.id)">
                <i class="bi bi-pencil-square"></i>
                <span class="d-none d-lg-inline-block">編輯</span>
              </button>
              <button class="btn btn-outline-danger" @click="openModal('remove', article.id)">
                <i class="bi bi-trash"></i>
                <span class="d-none d-lg-inline-block">移除</span>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <Pagination :pagination="pagination" v-show="pagination.total_pages > 1" @paginate="getArticles" />
  <ArticleModal ref="addEditModal" :id="article.id" @add-edit="addEditArticle"/>
  <RemoveModal type="文章" ref="removeModal" :item="article" @remove="getArticles"/>
</template>
<script>
  import ArticleModal from '@/components/ArticleModal.vue';
  import Pagination from '@/components/PaginationBar.vue';
  import RemoveModal from '@/components/RemoveModal.vue';
  export default {
    name: 'ArticleManage',
    inject: [ 'emitter' ],
    components: {
      ArticleModal,
      Pagination,
      RemoveModal,
    },
    data () {
      return {
        isLoading: false,
        articles: [],
        article: {},
        pagination: {},
      };
    },
    methods: {
      addEditArticle ( tempArticle ) {
        this.article = {
          ...tempArticle,
          create_at: new Date( tempArticle.create_at ).getTime()
        };
        const type = this.article.id ? 'put' : 'post';
        const api = this.article.id ? `${ process.env.VUE_APP_API }/api/${ process.env.VUE_APP_PATH }/admin/article/${ this.article.id }` : `${ process.env.VUE_APP_API }/api/${ process.env.VUE_APP_PATH }/admin/article`;
        this.$http[ type ](
          api,
          {
            data: this.article
          } ).then( response => {
            if ( response.data.success ) {
              this.$refs.addEditModal.closeModal();
              this.emitter.emit(
                'message', {
                type: 'success',
                title: this.article.id ? '文章編輯成功' : '文章新增成功',
                content: this.article.id ? '文章已更新' : '文章已新增'
              } );
            } else {
              this.emitter.emit(
                'message', {
                type: 'warning',
                title: this.article.id ? '文章編輯失敗' : '文章新增失敗',
                content: response.data.message
              } );
            }
          } ).catch( error => {
            this.emitter.emit(
              'message', {
              type: 'danger',
              title: this.article.id ? '文章編輯失敗' : '文章新增失敗',
              content: error.response.data.message
            } );
          } ).finally( () => {
            this.getArticles();
          } );
      },
      getArticles ( page = 1 ) {
        this.isLoading = true;
        this.$http.get(
          `${ process.env.VUE_APP_API }/api/${ process.env.VUE_APP_PATH }/admin/articles`,
          { params: { page } }
        ).then( response => {
          this.articles = response.data.articles;
          this.pagination = response.data.pagination;
        } ).catch( error => {
          this.emitter.emit(
            'message', {
            type: 'warning',
            title: '取得文章列表失敗',
            content: error.response.data.message
          } );
        } ).finally( () => {
          this.isLoading = false;
        } );
      },
      openModal ( action, id ) {
        if ( action === 'add' ) {
          this.article = {};
          this.$refs.addEditModal.showModal();
        } else if ( action === 'edit' ) {
          const article = this.articles.find( item => item.id === id );
          this.article = { ...article };
          this.$refs.addEditModal.showModal();
        } else if ( action === 'remove' ) {
          const article = this.articles.find( item => item.id === id );
          this.article = { ...article };
          this.$refs.removeModal.showModal();
        }
      },
    },
    mounted () {
      this.getArticles();
    }
  };
</script>