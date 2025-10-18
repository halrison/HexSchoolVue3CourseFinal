<template>
  <LoadingC :active="isLoading" :is-full-page="true" />
  <div class="container">
    <div class="row">
      <h1 class=" text-center">{{ article.title }}</h1>
    </div>
    <div class="row">
      <h6 class="text-center">{{ article.description }}</h6>
    </div>
    <img class="d-block mx-auto w-100" :src="article.image" />
    <p class="row">{{ article.content }}</p>
  </div>
</template>
<script>
  export default {
    name: 'ArticleDetail',
    inject: [ 'emitter' ],
    data () {
      return {
        article: {},
        isLoading: false
      }
    },
    mounted () {
      this.isLoading = true
      this.$http.get( `${ process.env.VUE_APP_API }/api/${ process.env.VUE_APP_PATH }/article/${ this.$route.query.id }`
      ).then( ( res ) => {
        if ( res.data.success ) {
          this.article = res.data.article
        } else {
          this.emitter.emit( 'message', { type: 'warning', title: '取得文章失敗', content: res.data.message } )
        }
      } ).catch( ( err ) => {
        this.emitter.emit( 'message', { type: 'danger', title: '取得文章失敗', content: err.response.data.message } )
      } ).finally( () => {
        this.isLoading = false
      } )
    }
  }
</script>