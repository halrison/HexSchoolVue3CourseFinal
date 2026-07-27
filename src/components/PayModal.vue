<template>
  <div class="modal fade" ref="DOM">
    <div class="modal-dialog" role="dialog">
      <FormC class="modal-content" v-slot="{ errors }" @submit="payOrder" @reset="hideModal">
        <div class="modal-header">訂單編號：{{$route.query.id }}</div>
        <div class="modal-body">
          <div class="row">
            <div class="col">付款方式</div>
            <div class="col">
              <FieldC label="付款方式" name="method" rules="required" class="form-select" v-model="payMethod" v-bind:class="{ 'is-invalid': errors['method'] }">
                <select>
                  <option disabled>請選擇</option>
                  <option value="credit-card">信用卡</option>
                  <option value="bank-account">銀行帳戶</option>
                  <option value="mobile-pay">行動支付</option>
                </select>
              </FieldC>
              <ErrorMessage name="method" class="invalid-feedback" />
            </div>
          </div>
          <div v-if="payMethod === 'credit-card'">
            <div class="row">
              <div class="col">發卡銀行</div>
              <div class="col">
                <FieldC label="發卡銀行" name="bank" class="form-control" type="text" rules="required" v-bind:class="{ 'is-invalid': errors['bank'] }" />
                <ErrorMessage name="bank" class="invalid-feedback" />
              </div>
            </div>
            <div class="row">
              <div class="col">卡號</div>
              <div class="col">
                <FieldC label="卡號" name="number" class="form-control" type="tel" rules="required|numeric" v-bind:class="{ 'is-invalid': errors['number'] }" />
                <ErrorMessage name="number" class="invalid-feedback" />
              </div>
            </div>
            <div class="row">
              <div class="col">持有人</div>
              <div class="col">
                <FieldC label="持有人" name="owner" class="form-control" type="text" rules="required" v-bind:class="{ 'is-invalid': errors['owner'] }" />
                <ErrorMessage name="owner" class="invalid-feedback" />
              </div>
            </div>
            <div class="row">
              <div class="col">效期</div>
              <div class="col">
                <FieldC label="效期" name="valid-thru" class="form-control" type="month" rules="required" v-bind:class="{ 'is-invalid': errors['valid-thru'] }" />
                <ErrorMessage name="valid-thru" class="invalid-feedback" />
              </div>
            </div>
            <div class="row">
              <div class="col">檢核碼</div>
              <div class="col">
                <FieldC label="檢核碼" name="checksum" class="form-control" type="tel" rules="required|numeric" v-bind:class="{ 'is-invalid': errors['checksum'] }" />
                <ErrorMessage name="checksum" class="invalid-feedback" />
              </div>
            </div>
          </div>
          <div v-else-if="payMethod === 'bank-account'">
            <div class="row">
              <div class="col">開戶總行</div>
              <div class="col">
                <FieldC label="開戶總行" name="head-office" class="form-control" type="text" rules="required" v-bind:class="{ 'is-invalid': errors['head-office'] }" />
                <ErrorMessage name="head-office" class="invalid-feedback" />
              </div>
            </div>
            <div class="row">
              <div class="col">開戶分行</div>
              <div class="col">
                <FieldC label="開戶分行" name="branch" class="form-control" type="text" rules="required" v-bind:class="{ 'is-invalid': errors['branch'] }" />
                <ErrorMessage name="branch" class="invalid-feedback" />
              </div>
            </div>
            <div class="row">
              <div class="col">帳號</div>
              <div class="col">
                <FieldC label="帳號" name="account" class="form-control" type="tel" rules="required|numeric" v-bind:class="{ 'is-invalid': errors['account'] }" />
                <ErrorMessage name="account" class="invalid-feedback" />
              </div>
            </div>
            <div class="row">
              <div class="col">戶名</div>
              <div class="col">
                <FieldC label="戶名" name="name" class="form-control" type="text" rules="required" v-bind:class="{ 'is-invalid': errors['name'] }" />
                <ErrorMessage name="name" class="invalid-feedback" />
              </div>
            </div>
            <div class="row">
              <div class="col">一次性密碼</div>
              <div class="col">
                <FieldC label="一次性密碼" name="otp" class="form-control" type="tel" rules="required|numeric" v-bind:class="{ 'is-invalid': errors['otp'] }" />
                <ErrorMessage name="otp" class="invalid-feedback" />
              </div>
            </div>
          </div>
          <div v-else-if="payMethod === 'mobile-pay'">
            <div class="row">
              <div class="col">支付服務</div>
              <div class="col">
                <div class="form-check">
                  <FieldC label="支付服務" name="service" class="form-check-input" type="radio" rules="required" value="linePay" v-bind:class="{ 'is-invalid': errors['service'] }" />
                  <label class="form-check-label">Line Pay</label>
                </div>
                <div class="form-check">
                  <FieldC label="支付服務" name="service" class="form-check-input" type="radio" rules="required" value="applePay" v-bind:class="{ 'is-invalid': errors['service'] }" />
                  <label class="form-check-label">Apple Pay</label>
                </div>
                <div class="form-check">
                  <FieldC label="支付服務" name="service" class="form-check-input" type="radio" rules="required" value="samsungPay" v-bind:class="{ 'is-invalid': errors['service'] }" />
                  <label class="form-check-label">Samsung Pay</label>
                </div>
                <div class="form-check">
                  <FieldC label="支付服務" name="service" class="form-check-input" type="radio" rules="required" value="googlePay" v-bind:class="{ 'is-invalid': errors['service'] }" />
                  <label class="form-check-label">Google Pay</label>
                </div>
                <div class="form-check">
                  <FieldC label="支付服務" name="service" class="form-check-input" type="radio" rules="required" value="jkopay" v-bind:class="{ 'is-invalid': errors['service'] }" />
                  <label class="form-check-label">街口支付</label>
                </div>
                <ErrorMessage name="service" class="invalid-feedback" />
              </div>
            </div>
            <div class="row">
              <div class="col">付款代碼</div>
              <div class="col">
                <FieldC label="付款代碼" name="code" class="form-control" type="tel" rules="required|numeric" v-bind:class="{ 'is-invalid': errors['code'] }" />
                <ErrorMessage name="code" class="invalid-feedback" />
              </div>
            </div>
            <div class="row">
              <div class="col">付款密碼</div>
              <div class="col">
                <FieldC label="付款密碼" name="password" class="form-control" type="password" rules="required|numeric" v-bind:class="{ 'is-invalid': errors['password'] }" />
                <ErrorMessage name="password" class="invalid-feedback" />
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <input type="submit" class="btn btn-primary" value="確定" />
          <input type="reset" class="btn btn-danger" value="取消" />
        </div>
      </FormC>
    </div>
  </div>
</template>
<script>
  import modal from "@/mixins/modal";
  export default {
    name: 'PayModal',
    mixins: [ modal ],
    methods: {
      payOrder () {
        this.$http.post(
          `${ process.env.VUE_APP_API }/api/${ process.env.VUE_APP_PATH }/pay/${ this.$route.query.id }`,
          { payMethod: this.payMethod }
        ).then( res => {
          if ( res.data.success ) {
            this.emitter.emit( 'message', { type: 'success', title: '付款成功', content: res.data.message } );
            this.hideModal();
          } else {
            this.emitter.emit( 'message', { type: 'warning', title: '付款失敗', content: res.data.message } );
          }
        } ).catch( err => {
          this.emitter.emit( 'message', { type: 'danger', title: '付款失敗', content: err.response.data.message } );
        } );
      }
    },
    data () {
      return {
        payMethod: ''
      };
    },
  };
</script>