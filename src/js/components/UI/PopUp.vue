<template>
    <div class="pop-up-wrapper" :class="{ 'show-modal': show }">
        <transition name="modal">
            <div
                v-if="show"
                class="pop-up-card">
                <img
                    v-if="close"
                    :src="require(`@/assets/icons/cross-mark.svg`)"
                    class="close-icon"
                    @click="closePopUp" />

                <slot name="title"></slot>

                <div class="body-container">
                    <slot name="body"></slot>
                </div>

                <div class="actions-container">
                    <slot name="actions"></slot>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        name: 'pop-up',

        props: {
            show: {
                required: true
            },
            close: {
                type: Boolean,
                required: false,
                default: false
            },
            hash: {
                type: String,
                required: false,
                default: ''
            },
            preventRedirect: {
                type: Boolean,
                required: false,
                default: false
            }
        },

        data() {
            return {
                prevHash: null
            }
        },

        watch: {
            show(to) {
                if(to)
                    this.$router.push({ hash: `#${this.hash}` })
                else
                    this.$router.replace({ hash: this.prevHash })
            }
        },

        mounted() {
            if (!this.preventRedirect) return
            this.prevHash = this.$route.hash
        },

        methods: {
            closePopUp() {
                this.$emit('closePopUp')
            }
        }
    }
</script>

<style lang="scss" src="@/styles/UI/popUp.scss"></style>