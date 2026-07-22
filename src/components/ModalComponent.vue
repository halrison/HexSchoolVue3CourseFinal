<template>
	<div class="modal fade" ref="DOM">
		<div class="modal-dialog" role="dialog" v-bind:class="size?`modal-${size}`:''">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">{{title}}</h5>
				</div>
				<slot></slot>
			</div>
		</div>
	</div>
</template>
<script>
import { Modal } from 'bootstrap'
export default {
  props:['size','title'],
  methods: {
    showModal () {
      this.modal.show()
    },
    hideModal () {
      this.modal.hide()
    }
  },
  mounted () {
    this.modal = new Modal(
      this.$refs.DOM,
      { backdrop: 'static' }
    )
  },
  data () { return { modal: null } }
}
</script>