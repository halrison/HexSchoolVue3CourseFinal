<template>
    <div class="modal fade" ref="DOM" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" v-bind:class="size?`modal-${size}`:''">
            <div class="modal-content">
                <slot />
            </div>
        </div>
    </div>
</template>
<script>
    import {Modal} from 'bootstrap'
    export default {
        props: {
            size: {
                type: String,
                default: null
            }
        },
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
                {keyboard: false}
            )
        },
        data () {return {modal: null}}
    }
</script>