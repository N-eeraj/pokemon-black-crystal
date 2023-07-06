<template>
    <div class="banner-container">
        <div
            class="banner-card"
            :style="backgroundImage">
            <div
                class="overlay"
                :style="`background-image: ${overlay};`">

                <strong
                    v-if="title"
                    class="card-title">
                    {{ $filters.toTitleCase(title) }}
                </strong>

                <slot></slot>

            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: 'banner-card',

        props: {
            image: {
                type: String,
                required: true
            },
            title: {
                type: String,
                required: false
            },
            overlay: {
                type: String,
                required: false
            }
        },

        computed: {
            backgroundImage() {
                return { backgroundImage: `url(${require('@/assets/' + this.image)})` }
            }
        }
    }
</script>

<style lang="scss" src="@/styles/UI/bannerCard.scss"></style>