<template>
    <div class="modal fade" tabindex="-1" ref="modalRef">
        <div class="modal-dialog" role="dialog" v-bind:class="size?`modal-${size}`:''">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ title }}</h5>
                </div>
                <div class="modal-body">
                    <slot name="body"></slot>
                </div>
                <div class="modal-footer">
                    <slot name="footer"></slot>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
    import {onMounted, ref, useTemplateRef} from 'vue'
    import {Modal} from 'bootstrap'
    const {item, title} = defineProps(['size', 'title'])
    const modalRef = useTemplateRef('modalRef')
    const modalObject = ref({})
    const showModal = () => {
        modalObject.value.show()
    }
    const hideModal = () => {
        modalObject.value.hide()
    }
    defineExpose({
        showModal,
        hideModal
    })
    onMounted(() => {
        modalObject.value = new Modal(
            modalRef.value,
            {
                keyboard: false,
                backdrop: 'static'
            }
        )
    })
</script>