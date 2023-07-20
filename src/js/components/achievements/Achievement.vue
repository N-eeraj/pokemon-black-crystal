<template>
    <div class="achievement-card">
        {{ name }}
        {{ badge }}
        {{ required }}
        {{ current }}
    </div>
</template>

<script>
    export default {
        name: 'achievement',

        props: {
            name: {
                type: String,
                required: true
            },
            badge: {
                type: String,
                required: true
            },
            required: {
                type: Array,
                required: true
            },
            current: {
                type: Number,
                required: false,
                default: 0
            }
        }
    }
</script>

<style lang="scss" scoped src="@/styles/home/achievements/item.scss"></style>