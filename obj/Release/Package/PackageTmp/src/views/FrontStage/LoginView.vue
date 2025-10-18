<template>
  <LoadingC :is-full-page="true" :active="isLoading" />
  <div class="container position-relative">
    <div class="position-absolute h-100"></div>
    <FormC class="row justify-content-center" v-slot="{ errors }" @submit="login">
      <div class="col-md-6">
        <h1 class="h3 my-3 font-weight-normal">請先登入</h1>
        <div class="mb-2">
          <label for="inputEmail" class="sr-only">Email address</label>
          <FieldC type="email" id="inputEmail" class="form-control" placeholder="Email address" rules="required" name="username"
            v-model="user.username" :class="{ 'is-invalid': errors['username'] }" />
          <ErrorMessage name="username" class="invalid-feedback" />
        </div>
        <div class="mb-2">
          <label for="inputPassword" class="sr-only">Password</label>
          <FieldC type="password" id="inputPassword" class="form-control" placeholder="Password" name="password" rules="required"
            v-model="user.password" :class="{ 'is-invalid': errors['password'] }" />
          <ErrorMessage name="password" class="invalid-feedback" />
        </div>
        <div class="text-end my-4">
          <button class="btn btn-lg btn-primary btn-block" type="submit">登入</button>
        </div>
      </div>
    </FormC>
  </div>
</template>

<script setup>
  import { reactive } from "vue"
  import { useRouter } from "vue-router"
  import { storeToRefs } from "pinia"
  import Axios from "axios"
  import useLoadingStore from "@/stores/loading"
  import useMessageStore from "@/stores/messages"

  const { isLoading } = storeToRefs(useLoadingStore())
  const user = reactive({
    username: '',
    password: ''
  })
  const router = useRouter()

  isLoading.value = true
  setTimeout(
    function () { isLoading.value = false },
    1000
  )

  function login () {
    Axios.post(
      `${import.meta.env.VITE_API}admin/signin`, 
      {
        username: user.username,
        password: user.password
      }
    ).then(function (response) {
      if (response.data.success) {
        sessionStorage.setItem('token', response.data.token)
        router.push({ 
          path: '/admin/product' 
        })
      }
    }).catch(function (error) { 
      useMessageStore().pushMessage('danger', error?.message)
    })
  }
</script>

<style scoped>
  .position-absolute {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-image: url(https://images.unsplash.com/photo-1480399129128-2066acb5009e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1920&q=80);
    background-position: center center;
    opacity: 0.1;
    z-index: -1;
  }
</style>