<template>
  <div class="modal fade" ref="DOM">
    <div class="modal-dialog" role="dialog">
      <FormC class="modal-content" v-slot="{ errors }" @submit="$emit('add-edit',tempArticle)" @reset="hideModal" :initial-values="tempArticle" :initial-errors="error">
        <div class="modal-header">{{ tempArticle.id ? '編輯' : '新增' }}文章</div>
        <div class="modal-body container">
          <div class="row py-1">
            <div class="col-3">
              <label for="title">標題</label>
            </div>
            <div class="col-9">
              <FieldC label="標題" name="title" class="form-control" id="title" type="text" rules="required" v-model="tempArticle.title" v-bind:class="{ 'is-invalid': errors['title'] }" />
              <ErrorMessage class="invalid-feedback" name="title" />
            </div>
          </div>
          <div class="row py-1">
            <div class="col-3">
              <label for="image">圖片</label>
            </div>
            <div class="col-9">
              <div>
                <label for="image" class="form-label">輸入圖片網址</label>
                <br />
                <p class="mb-3 input-group">
                  <FieldC label="網址" name="url" rules="url" type="text" class="form-control" id="image" aria-describedby="addImage" placeholder="請輸入圖片連結"
                          v-model="tempUrl" :standalone="true" v-bind:class="{ 'is-invalid': errors['url'] }" />
                  <button id="addImage" type="button" class="btn btn-outline-primary btn-sm"
                          @click="addImage(tempUrl,url=>tempArticle.image=url)" v-bind:disabled="!tempUrl">
                    新增圖片
                  </button>
                </p>
                <ErrorMessage class="invalid-feedback" name="url" />
              </div>
              <div class="mb-3">
                <label for="input" class="form-label">或上傳圖片</label>
                <FieldC class="form-control" name="file" type="file" rules="image" label="選取檔案"
                        @change="event=>uploadImage(event.target.files, url=>tempUrl=url)" v-bind:class="{ 'is-invalid': errors['file'] }" :standalone="true" />
                <ErrorMessage name="file" class="invalid-feedback" :style="{'display': errors['file'] ? 'block' : 'none' }" />
              </div>
            </div>
          </div>
          <div class="row py-1">
            <div class="col-3">
              <label for="tag">標籤</label>
            </div>
            <div class="col-9">
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
            <div class="col-3">
              <label for="description">描述</label>
            </div>
            <div class="col-9">
              <textarea class="form-control" id="description" rows="2" cols="40" v-model="tempArticle.description" />
            </div>
          </div>
          <div class="row py-1">
            <div class="col-3">
              <label for="content">內容</label>
            </div>
            <div class="col-9">
              <FieldC label="內容" as="textarea" name="content" class="form-control" id="content" rows="2" cols="40" rules="required"
                      v-model="tempArticle.content" v-bind:class="{ 'is-invalid': errors['content'] }" />
              <ErrorMessage class="invalid-feedback" name="content" />
            </div>
          </div>
          <div class="row py-1">
            <div class="col-3">
              <label for="author">作者</label>
            </div>
            <div class="col-9">
              <FieldC label="作者" name="author" class="form-control" id="author" type="text" rules="required"
                      v-model="tempArticle.author" v-bind:class="{ 'is-invalid': errors['author'] }" />
              <ErrorMessage class="invalid-feedback" name="author" />
            </div>
          </div>
          <div class="row">
            <div class="col">
              <label class="form-check-label" for="public">是否公開</label>
            </div>
            <div class="col">
              <input class="form-check-input" id="public" type="checkbox"
                     v-model="tempArticle.isPublic" v-bind:class="{ 'is-invalid': errors['public'] }" />
            </div>
            <div class="col">
              <label for="date">建立日期</label>
            </div>
            <div class="col">
              <FieldC label="建立日期" name="date" class="form-control" id="date" type="date" rules="required"
                      v-model="tempArticle.create_at" v-bind:class="{ 'is-invalid': errors['date'] }" />
              <ErrorMessage class="invalid-feedback" name="date" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-primary">確定</button>
          <button type="reset" class="btn btn-danger">取消</button>
        </div>
      </FormC>
    </div>
  </div>
</template>
<script>
  import modal from "@/mixins/modal";
  import { addImage, uploadImage } from "@/util";
  export default {
    name: "ArticleModal",
    mixins: [ modal ],
    inject: [ "emitter" ],
    props: {
      id: {
        type: String,
        default: "",
      },
    },
    methods: {
      addTag ( tag ) {
        if ( !tag ) {
          return;
        }
        if ( !Array.isArray( this.tempArticle.tag ) ) {
          this.tempArticle.tag = [];
        }
        if ( this.tempArticle.tag.includes( tag ) ) {
          this.emitter.emit( "message", { type: 'info', title: '標籤已重複' } );
          return;
        }
        this.tempArticle.tag.push( tag );
        this.tempTag = "";
      },
      removeTag ( tag ) {
        if ( !Array.isArray( this.tempArticle.tag ) ) {
          return;
        }
        const index = this.tempArticle.tag.indexOf( tag );
        if ( index > -1 ) {
          this.tempArticle.tag.splice( index, 1 );
        }
      },
      AddImage ( url ) {
        if ( !url ) {
          return;
        }
        addImage( url, imgUrl => {
          if ( imgUrl ) {
            this.tempArticle.image = imgUrl;
          }
        } )
        this.tempUrl = "";
      },
      UploadImage ( files ) {
        uploadImage(
          files,
          url => {
            this.AddImage( url )
            this.emitter.emit(
              'message', {
              type: 'success',
              title: '圖片上傳成功',
              content: `已上傳至${ url }`
            }
            );
          }
        );
      }
    },
    watch: {
      id ( newId ) {
        if ( newId ) {
          this.$http.get( `${ process.env.VUE_APP_API }/api/${ process.env.VUE_APP_PATH }/admin/article/${ newId }` )
            .then( res => {
              this.tempArticle = {
                ...res.data.article,
                create_at: this.$filters.transDate( res.data.article.create_at )
              };
              this.tempUrl = res.data.article.image;
            } )
            .catch( err => {
              this.emitter.emit(
                'message',
                {
                  type: 'danger',
                  title: '取得文章失敗',
                  content: err.response.data.message
                } );
            } )
            .finally( () => {
              this.tempTag = "";
            } );
        } else {
          this.tempArticle = {
            title: "",
            image: "",
            tag: [],
            description: "",
            content: "",
            create_at: this.$filters.transDate( Date.now() )
          }
          this.tempUrl = "";
          this.error = {};
        }
      }
    },
    data () {
      return {
        error: {},
        tempArticle: {
          create_at: this.$filters.transDate( Date.now() )
        },
        tempTag: "",
        tempUrl: ""
      }
    },
    mounted () {
      this.error = {};
    }
  }
</script>