<template>
    <LoadingC :is-full-page="true" :active="isLoading" />
    <div class="position-relative">
        <div class="position-absolute h-100"></div>
        <form class="justify-content-center" @submit="signin">
            <div class="container my-3">
                <h1 class="font-weight-normal text-center">請先登入</h1>
                <div class="row mb-2">
                    <div class="col-3 text-center">
                        <label for="inputEmail" class="sr-only">電子信箱</label>
                    </div>
                    <div class="col-9">
                        <input type="email" id="inputEmail" class="form-control" placeholder="Email address" v-bind:class="{ 'is-invalid': errors.username}"  v-model="username"/>
                        <span class="invalid-feedback">{{errorBag.username?.[0]}}</span>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-3 text-center">
                        <label for="inputPassword" class="sr-only">密碼</label>
                    </div>
                    <div class="col-9">
                        <input type="password" id="inputPassword" class="form-control" placeholder="Password"  v-bind:class="{ 'is-invalid': errors.password }" v-model="password"/>
                        <span class="invalid-feedback" >{{errorBag.password?.[0]}}</span>
                    </div>
                </div>
                <div class="text-center my-4">
                    <input class="btn btn-lg btn-primary btn-block" type="submit" value="登入" />
                </div>
            </div>
            <div class="alert alert-danger" role="alert" v-if="errorMessage?.code">
                <h4 class="alert-heading">{{errorMessage?.code === 'auth/user-not-found' ? '帳號錯誤' : '密碼錯誤'}}</h4>
                <h6>{{errorMessage?.code === 'auth/user-not-found' ? '帳號輸入錯誤或未註冊' : '密碼錯誤或未設置'}}</h6>
            </div>
        </form>
    </div>
</template>
<script setup>
    import {inject, reactive} from'vue'
    import {useRouter} from'vue-router'
    import {useForm} from'vee-validate'
    import useLoadingStore from'@/stores/loading'
    const http = inject('http')
    const errorMessage = reactive({})
    const {defineField, errorBag, errors, handleSubmit} = useForm({
        validationSchema : {
            username: 'required|email',
            password: 'required'
        }
    })
    const [username] = defineField('username', {label: '此欄位'})
    const [password] = defineField('password', {label: '此欄位'})
    const router = useRouter()
    const isLoading = useLoadingStore()
    const signin = handleSubmit(user => {
        isLoading.value = true
        errorMessage.code = ''
        http({
            method: 'post',
            url: `${import.meta.env.VITE_API}/admin/signin`,
            data: user
        }).then(response => {
            if (response.data.success) {
                document.cookie = `hexToken=${response.data.token}; expires=${new Date(response.data.expired * 1000)}; path=/`
                router.push({path: '/admin/products'})
            } else Object.assign(errorMessage, response.data.error)
        }).catch(error => {
            Object.assign(errorMessage, error.response.data.error)
        }).finally(() => {
            isLoading.value = false
        })
    })
</script>