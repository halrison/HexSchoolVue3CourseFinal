<template>
    <LoadingC :is-full-page="true" :active="isLoading" />
    <div class="position-relative">
        <div class="position-absolute h-100"></div>
        <FormC class="justify-content-center" v-slot="{ errors }" @submit="signin" :validation-schema="schema">
            <div class="container my-3">
                <h1 class="font-weight-normal text-center">請先登入</h1>
                <div class="row mb-2">
                    <div class="col-3 text-center">
                        <label for="inputEmail" class="sr-only">電子信箱</label>
                    </div>
                    <div class="col-9">
                        <FieldC type="email" id="inputEmail" class="form-control" placeholder="Email address" name="username"
                                label="此欄位" v-bind:class="{ 'is-invalid': errors['username'] }" />
                        <ErrorMessage name="username" class="invalid-feedback" />
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-3 text-center">
                        <label for="inputPassword" class="sr-only">密碼</label>
                    </div>
                    <div class="col-9">
                        <FieldC type="password" id="inputPassword" class="form-control" placeholder="Password" name="password"
                                label="此欄位" v-bind:class="{ 'is-invalid': errors['password'] }" />
                        <ErrorMessage name="password" class="invalid-feedback" />
                    </div>
                </div>
                <div class="text-center my-4">
                    <input class="btn btn-lg btn-primary btn-block" type="submit" value="登入" />
                </div>
            </div>
            <div class="alert alert-danger" role="alert" v-show="error?.code">
                <h4 class="alert-heading">{{error?.code === 'auth/user-not-found' ? '帳號錯誤' : '密碼錯誤'}}</h4>
                <h6>{{error?.code === 'auth/user-not-found' ? '帳號輸入錯誤或未註冊' : '密碼錯誤或未設置'}}</h6>
            </div>
        </FormC>
    </div>
</template>
<script>
    export default {
        data () {
            return {                
                error: {},
                isLoading: false
            }
        },
		computed:{
			schema() {
				return {
					username: 'required|email',
					password: 'required'
				}
			}
		},
        methods: {
            signin (user) {
                this.isLoading = true
				this.error={}
                this.$http.post(
                    `${process.env.VUE_APP_API}/admin/signin`,
                    user
                ).then(response => {
                    if (response.data.success) {
                        document.cookie = `hexToken=${response.data.token}; expires=${new Date(response.data.expired * 1000)}; path=/`
                        this.$router.push({path: '/admin/products'})
                    } else this.error = response.data.error
                }).catch(error => {
                    this.error = error.response.data.error
                }).finally(() => {
                    this.isLoading = false
                })
            }
        }
    }
</script>