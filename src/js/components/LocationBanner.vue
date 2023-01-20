<template>
    <div class="location-container">
        <div
            class="location-banner"
            :style="backgroundImage">
            <div
                class="overlay"
                :style="`background-image: ${overlay};`">
                <strong>
                    {{ $filters.toTitleCase(title) }}
                </strong>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'location-banner',

        props: {
            image: {
                type: String,
                required: true
            },
            title: {
                type: String,
                required: true
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

<style lang="scss" src="@/styles/locationBanner.scss"></style>