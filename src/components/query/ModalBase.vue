<template>
    <div class="modal fade" :class="{show:modal.show}" v-if="modal.exist" ref="modal" @click="modal_clicked">
        <slot></slot>
    </div>
    <div class="modal-backdrop fade" :class="{show:backdrop.show}" v-if="backdrop.exist"></div>
</template>

<script>
export default {
    name: "ModalBase",
    data() {
        return {
            modal: {
                show: false,
                exist: false
            },
            backdrop: {
                show: false,
                exist: false
            }
        }
    },
    emits: ["backdropClick"],
    methods: {
        open() {
            let vm = this;
            this.backdrop.exist = true;
            setTimeout(() => {
                vm.backdrop.show = true;
                setTimeout(() => {
                    vm.modal.exist = true;
                    setTimeout(() => {
                        vm.modal.show = true
                    }, 5);
                }, 150);
            }, 5);
        },
        close() {
            let vm = this;
            this.modal.show = false;
            this.backdrop.show = false;
            setTimeout(() => {
                vm.modal.exist = false;
                vm.backdrop.exist = false;
            }, 150);
        },
        modal_clicked(ev) {
            if (ev.target === this.$refs.modal) {
                this.$emit("backdropClick");
            }
        }
    }
}
</script>

<style scoped>
.modal {
    display: block;
}
</style>