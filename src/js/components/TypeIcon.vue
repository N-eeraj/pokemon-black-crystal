<template>
    <div
        :style="`background-image: url(${icon});`">
    </div>
</template>

<script>
    export default {
        name: 'type-icon',

        props: {
            type: {
                type: String,
                required: true
            }
        },

        computed: {
            icon() {
                return require(`@/assets/images/type-icons/${this.type}.webp`)
            }
        },
    }
</script>

<style scoped>
    div {
        width: 25px;
        aspect-ratio: 1;
        background-size: contain;
    }
</style>