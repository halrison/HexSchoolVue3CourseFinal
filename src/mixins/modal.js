// JavaScript source code
import { Modal } from 'bootstrap'
export default {
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
      { keyboard: false }
    )
  },
  data () { return { modal: null } }
}