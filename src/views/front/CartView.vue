<template>
  <LoadingC :active="isLoading" :is-full-page="true" />
  <FormC class="container" v-if="cartList?.length" @submit="addOrder" v-slot="{ errors, validate }">
    <table class="table table-borderless mx-auto w-100">
      <thead>
        <tr class="row">
          <th class="col-1">刪除</th>
          <th class="col-6">品名</th>
          <th class="col-2 text-end">數量</th>
          <th class="col-3 text-end">小計</th>
        </tr>
      </thead>
      <tbody>
        <tr class="row" v-for="cart in cartList" :key="cart.id">
          <td class="col-1">
            <button type="button" class="btn btn-outline-danger" @click="removeCart(cart.id)">
              <i class="bi bi-cart-x-fill"></i>
            </button>
          </td>
          <td class="col-6">{{ cart.product.title }}</td>
          <td class="col-2 text-end">
            <div class="input-group d-inline-block">
              <div class="input-group bg-light rounded">
                <div class="input-group-prepend">
                  <button class="btn btn-outline-dark border-0 py-2" type="button" @click="editCart(cart.id, cart.qty - 1)" v-bind:disabled="cart.qty < 2">
                    <i class="bi bi-dash"></i>
                  </button>
                </div>
                <input type="text" class="form-control border-0 text-center my-auto shadow-none bg-light" required min="1"
                       aria-label="Example text with button addon" aria-describedby="button-addon1"
                       v-model.number="cart.qty" v-bind:class="{ 'is-invalid': !cart.qty || cart.qty.toString().includes('.') }" @change="editCart(cart.id, cart.qty)" />
                <div class="input-group-append">
                  <button class="btn btn-outline-dark border-0 py-2" type="button" @click="editCart(cart.id, cart.qty + 1)">
                    <i class="bi-plus bi"></i>
                  </button>
                </div>
              </div>
            </div>
            <span v-if="!cart.qty" class="text-danger">商品數量為必填</span>
            <span v-else-if="cart.qty.toString().includes('.')" class="text-danger">商品數量需為整數</span>
          </td>
          <td class="col-3 text-end">{{ $filter.currency(cart.total) }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="row" v-if="final_total === total">
          <th class="col-6"></th>
          <td class="col-3 text-end">總計</td>
          <td class="col-3 text-end">{{ $filter.currency(total) }}</td>
        </tr>
        <tr class="row" v-else>
          <th class="col-1">折扣</th>
          <td class="col-6">{{ $filter.currency(total - final_total) }}</td>
          <th class="col-2 text-end">優惠價</th>
          <td class="col-3 text-end">{{ $filter.currency(final_total) }}</td>
        </tr>
      </tfoot>
    </table>
    <div class="input-group">
      <label class="input-group-text" for="code">輸入優惠碼</label>
      <input class="form-control" id="code" type="text" v-model="code" />
      <button class="btn btn-secondary" @click="applyCoupon(code)">
        <i class="bi bi-percent"></i>
        套用優惠碼
      </button>
      <button class="btn btn-danger" @click="removeCarts">
        <i class="bi bi-cart-x"></i>
        清空購物車
      </button>
    </div>
    <hr />
    <div class=" text-center">
      <div class="row">
        <div class="col-3">姓名</div>
        <div class="col-9">
          <FieldC class="form-control" rules="required" name="name" label="姓名" v-model="user.name" v-bind:class="{ 'is-invalid': errors['name'] }" />
          <ErrorMessage class="text-danger" name="name" />
        </div>
      </div>
      <div class="row">
        <div class="col-3">地址</div>
        <div class="col-9">
          <FieldC class="form-control" rules="required" name="address" label="地址" v-model="user.address" v-bind:class="{ 'is-invalid': errors['address'] }" />
          <ErrorMessage class="text-danger" name="address" />
        </div>
      </div>
      <div class="row">
        <div class="col-3">電話</div>
        <div class="col-9">
          <FieldC class="form-control" rules="required|isPhone" name="tel" label="電話" v-model="user.tel" v-bind:class="{ 'is-invalid': errors['tel'] }" />
          <ErrorMessage class="text-danger" name="tel" />
        </div>
      </div>
      <div class="row">
        <div class="col-3">電子信箱</div>
        <div class="col-9">
          <FieldC class="form-control" name="email" rules="required|email" label="電子信箱" v-model="user.email" v-bind:class="{ 'is-invalid': errors['email'] }" />
          <ErrorMessage class="text-danger" name="email" />
        </div>
      </div>
      <div class="row">
        <div class="col-3">留言</div>
        <div class="col-9">
          <textarea class="form-control" v-model="message" rows="2" cols="20"></textarea>
        </div>
      </div>
      <div class="row">
        <div class="my-2">
          <button class="btn btn-primary" type="submit" @submit="validate">前往付款</button>
        </div>
      </div>
    </div>
    <RemoveModal ref="modal" :item="cartItem" :type="type" />
  </FormC>
  <h1 class="text-center vh-100" v-else>未選購任何商品</h1>
</template>
<script>
  import RemoveModal from '@/components/RemoveModal.vue';
  export default {
    name: 'CartView',
    inject: [ 'emitter' ],
    components: {
      RemoveModal,
    },
    methods: {
      getCart () {
        this.isLoading = true;
        this.$http.get( `${ process.env.VUE_APP_API }/api/${ process.env.VUE_APP_PATH }/cart`
        ).then( res => {
          if ( res.data.success ) {
            this.cartList = res.data.carts;
            this.total = res.data.total;
            this.final_total = res.data.final_total;
          } else {
            this.emitter.emit( 'message', { type: 'warning', title: '取得購物車失敗', content: res.data.message } );
          }
        } ).catch( err => {
          this.emitter.emit( 'message', { type: 'danger', title: '取得購物車失敗', content: err.response.data.message } );
        } ).finally( () => {
          this.isLoading = false;
        } );
      },
      removeCart ( id ) {
        this.cartItem = id;
        this.type = '購物車';
        this.$refs.modal.showModal();
      },
      removeCarts () {
        this.cartItem = null;
        this.type = 'carts';
        this.$refs.modal.showModal();
      },
      editCart ( id, qty ) {
        if ( qty < 1 || qty.toString().includes( '.' ) ) {
          return;
        }
        this.isLoading = true;
        this.$http.put(
          `${ process.env.VUE_APP_API }/api/${ process.env.VUE_APP_PATH }/cart/${ id }`,
          {
            product_id: id,
            qty
          } ).then( res => {
            if ( res.data.success ) {
              this.emitter.emit( 'message', { type: 'success', title: '編輯購物車成功', content: res.data.message } );
            } else {
              this.emitter.emit( 'message', { type: 'warning', title: '編輯購物車失敗', content: res.data.message } );
            }
          } ).catch( err => {
            this.emitter.emit( 'message', { type: 'danger', title: '編輯購物車失敗', content: err.response.data.message } );
          }
          ).finally( () => {
            this.getCart();
          } );
      },
      addOrder () {
        if ( !this.cartList.length ) {
          return;
        }
        const order = {
          user: this.user,
          message: this.message,
        };
        this.$http.post(
          `${ process.env.VUE_APP_API }/api/${ process.env.VUE_APP_PATH }/order`,
          {
            order
          } ).then( ( res ) => {
            if ( res.data.success ) {
              this.emitter.emit( 'message', { type: 'success', title: '送出訂單成功', content: res.data.message } );
              this.$router.push( { name: 'Order', params: { id: res.data.orderId } } );
            } else {
              this.emitter.emit( 'message', { type: 'warning', title: '送出訂單失敗', content: res.data.message } );
            }
          } ).catch( ( err ) => {
            this.emitter.emit( 'message', { type: 'danger', title: '送出訂單失敗', content: err.response.data.message } );
          } );
      },
      applyCoupon ( code ) {
        this.$http.post(
          `${ process.env.VUE_APP_API }/api/${ process.env.VUE_APP_PATH }/coupon`,
          {
            code
          } ).then( ( res ) => {
            if ( res.data.success ) {
              this.emitter.emit( 'message', { type: 'success', title: '套用優惠券成功', content: res.data.message } );
              this.final_total = res.data.final_total;
            } else {
              this.emitter.emit( 'message', { type: 'warning', title: '套用優惠券失敗', content: res.data.message } );
            }
          } ).catch( ( err ) => {
            this.emitter.emit( 'message', { type: 'danger', title: '套用優惠券失敗', content: err.response.data.message } );
          } );
      },
      validate () {
        this.$refs.form.validate().then( valid => {
          if ( valid ) {
            this.addOrder();
          } else {
            this.emitter.emit( 'message', { type: 'warning', title: '表單資料有誤', content: '請確認欄位資料皆正確填寫' } );
          }
        } );
      }
    },
  data() {
    return {
      isLoading: false,
      cartList: [],
      total: 0,
      final_total: 0,
      code: '',
      user: {
        name: '',
        email: '',
        tel: '',
        address: ''
      },
      message: '',
      cartItem: null,
      type: '購物車',
    };
  },
  mounted() {
    this.getCart();
  }
  }
</script>