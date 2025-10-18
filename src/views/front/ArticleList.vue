<template>
  <LoadingC :is-full-page="true" :active="isLoading" />
  <div class="container">
    <div class="row">
      <nav class="col-3 bg-light float-start">
        <div class="position-sticky pt-3">
          <p>標籤篩選</p>
          <p class="form-check" v-for="tag in tags" :key="tag">
            <input class="form-check-input" type="checkbox" :value="tag" v-model="selected" />
            <label class="form-check-label">{{ tag }}</label>
          </p>
        </div>
      </nav>
      <div class="col-9 mt-1">
        <div class="card-group row">
          <div class="col-12 col-md-6 col-lg-4 row" v-for="article in filterArticles" :key="article.id">
            <ArticleCard :article="article" />
          </div>
        </div>
      </div>
    </div>
    <Pagination :pagination="pagination" v-show="pagination.total_pages > 1" @paginate="getArticles" />
  </div>
</template>
<script>
  import ArticleCard from '@/components/ArticleCard.vue';
  import Pagination from '@/components/PaginationBar.vue';
  export default {
    name: 'ArticleList',
    inject: [ 'emitter' ],
    components: {
      ArticleCard,
      Pagination,
    },
    methods: {
      getArticles ( page = 1 ) {
        this.isLoading = true;
        this.$http.get(
          `${ process.env.VUE_APP_API }/api/${ process.env.VUE_APP_PATH }/articles`,
          { params: { page } }
        )
          .then( ( response ) => {
            if ( response.data.success ) {
              this.articles = response.data.articles.filter( article => article.isPublic );
              this.pagination = response.data.pagination;
            } else { this.emitter.emit( 'message', { type: 'warning', title: '取得文章列表失敗', content: response.data.message } ) }
          } )
          .catch( ( error ) => {
            this.emitter.emit( 'message', { type: 'danger', title: '取得文章列表失敗', content: error.response.data.message } );
          } ).finally( () => {
            this.isLoading = false;
          } );
      }
    },
    data () {
      return {
        articles: [],
        pagination: {},
        isLoading: false,
        selected: []
      };
    },
    computed: {
      filterArticles () {
        if ( this.selected.length ) {
          return this.articles.filter( article => {
            if ( article?.tag ) return article.tag.some( t => this.selected.includes( t ) );
          } );
        } else {
          return this.articles;
        }
      },
      tags () {
        return Array.from( new Set( this.articles.flatMap( article => article.tag ) ) ).filter( tag => !!tag );
      },
    },
    created () {
      this.getArticles();
    }
  };
</script>