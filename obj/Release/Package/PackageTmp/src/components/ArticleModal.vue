<template>
  <div class="modal fade" ref="DOM">
    <div class="modal-dialog" role="dialog">
      <FormC class="modal-content" v-slot="{ errors }" @submit="addEditArticle" @reset="hide" :initial-values="article" :initial-errors="error">
        <div class="modal-header">{{ article.id ? '編輯' : '新增' }}文章</div>
        <div class="modal-body container">
          <div class="row py-1">
            <div class="col-3">
              <label for="title">標題</label>
            </div>
            <div class="col-9">
              <FieldC label="標題" name="title" class="form-control" id="title" type="text" rules="required" v-model="article.title" :class="{ 'is-invalid': errors['title'] }" />
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
                         v-model="tempUrl" :standalone="true" :class="{ 'is-invalid': errors['url'] }" />
                  <button id="addImage" type="button" class="btn btn-outline-primary btn-sm"
                          @click="addImage(tempUrl,url=>article.image=url)" :disabled="!tempUrl">
                    新增圖片
                  </button>
                </p>
                <ErrorMessage class="invalid-feedback" name="url" />
              </div>
              <div class="mb-3">
                <label for="input" class="form-label">或上傳圖片</label>
                <FieldC class="form-control" name="file" type="file" rules="image" label="選取檔案"
                       @change="event=>UploadImage(event.target.files, url=>tempUrl=url)" :class="{ 'is-invalid': errors['file'] }" :standalone="true" />
                <ErrorMessage name="file" class="invalid-feedback" :style="{'display': errors['file'] ? 'block' : 'none' }" />
              </div>
            </div>
          </div>
          <div class="row py-1">
            <div class="col-3">
              <label for="tag">標籤</label>
            </div>
            <div class="col-9">
              <p v-if="Array.isArray(article.tag)">
                <span class="badge rounded-pill bg-secondary" v-for="tag in article.tag" :key="tag">
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
              <textarea class="form-control" id="description" rows="2" cols="40" v-model="article.description" />
            </div>
          </div>
          <div class="row py-1">
            <div class="col-3">
              <label for="content">內容</label>
            </div>
            <div class="col-9">
              <FieldC label="內容" as="textarea" name="content" class="form-control" id="content" rows="2" cols="40" rules="required"
                     v-model="article.content" :class="{ 'is-invalid': errors['content'] }" />
              <ErrorMessage class="invalid-feedback" name="content" />
            </div>
          </div>
          <div class="row py-1">
            <div class="col-3">
              <label for="author">作者</label>
            </div>
            <div class="col-9">
              <FieldC label="作者" name="author" class="form-control" id="author" type="text" rules="required"
                     v-model="article.author" :class="{ 'is-invalid': errors['author'] }" />
              <ErrorMessage class="invalid-feedback" name="author" />
            </div>
          </div>
          <div class="row">
            <div class="col">
              <label class="form-check-label" for="public">是否公開</label>
            </div>
            <div class="col">
              <input class="form-check-input" id="public" type="checkbox"
                     v-model="article.isPublic" :class="{ 'is-invalid': errors['public'] }" />
            </div>
            <div class="col">
              <label for="date">建立日期</label>
            </div>
            <div class="col">
              <FieldC label="建立日期" name="date" class="form-control" id="date" type="date" rules="required"
                     v-model="article.create_at" :class="{ 'is-invalid': errors['date'] }" />
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

<script setup>
  import { onMounted, ref, watch } from 'vue'
  import { Modal } from 'bootstrap'
  import { storeToRefs } from 'pinia'
  import { addImage, uploadImage as UploadImage } from "../util"
  import useArticleStore from "@/stores/articles"

  const DOM = ref(null)
  const tempUrl = ref('')
  const tempTag = ref('')
  const prop = defineProps(['article'])
  const ArticleStore = useArticleStore()
  const { getArticle } = ArticleStore
  const { article } = storeToRefs(ArticleStore)
  const error = {
    "title": undefined,
    "url": undefined,
    "file": undefined,
    "date": undefined,
    "author": undefined,
    "content": undefined
  }
  let modal

  onMounted(function () {
    modal = new Modal(DOM.value)
    tempTag.value = ''
  })
  watch(
    () => prop.article,
    async function (newValue) {
      if (newValue.id) {
        await getArticle(newValue.id, 'admin')
      } else {
        article.value = newValue
      }
      tempUrl.value = newValue.image
    }
  )
  defineExpose({ show })

  function show () { 
    modal.show()
  }
  function hide () {
    modal.hide()
    ArticleStore.getArticles(1, 'admin')
  }
  function addTag (tagName) {
    article.value.tag ||= []
    article.value.tag.push(tagName)
    tempTag.value = ''
  }
  function removeTag (tagName) {
    article.value.tag = article.value.tag.filter(tag => tag !== tagName)
  }
  function addEditArticle () {
    article.value.create_at = Date.parse(article.value.create_at)
    article.value.tag ||= []
    article.value.image = tempUrl.value
    if (article.value.id) {
      ArticleStore.editArticle(article)
    } else {
      ArticleStore.addArticle(article)
    }
    hide()
  }
</script>