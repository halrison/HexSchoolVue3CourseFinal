<template>
  <LoadingC :is-full-page="true" :active="isLoading" />
  <div class="container position-relative">
    <div class="position-absolute h-100"></div>
    <FormC class="row justify-content-center" v-slot="{ errors }" @submit="signin">
      <div class="col-md-6">
        <h1 class="h3 my-3 font-weight-normal text-center">請先登入</h1>
        <div class="mb-2">
          <label for="inputEmail" class="sr-only">Email address</label>
          <FieldC type="email" id="inputEmail" class="form-control" placeholder="Email address" rules="required" name="username"
                  v-model="user.username" v-bind:class="{ 'is-invalid': errors['username'] }" />
          <ErrorMessage name="username" class="invalid-feedback" />
        </div>
        <div class="mb-2">
          <label for="inputPassword" class="sr-only">Password</label>
          <FieldC type="password" id="inputPassword" class="form-control" placeholder="Password" name="password" rules="required"
                  v-model="user.password" v-bind:class="{ 'is-invalid': errors['password'] }" />
          <ErrorMessage name="password" class="invalid-feedback" />
        </div>
        <div class="text-center my-4">
          <button class="btn btn-lg btn-primary btn-block" type="submit">登入</button>
        </div>
      </div>
    </FormC>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        user: {
          username: '',
          password: ''
        },
        isLoading: false
      }
    },
    methods: {
      signin () {
        this.$http.post(
          `${ process.env.VUE_APP_API }/admin/signin`,
          this.user
        ).then( res => {
          if ( res.data.success ) {
            document.cookie = `hexToken=${ res.data.token }; expires=${ new Date( res.data.expired * 1000 ) }; path=/`
            this.$router.push( { path: '/admin/products' } )
          }
        } )
      }
    }
  }
</script>