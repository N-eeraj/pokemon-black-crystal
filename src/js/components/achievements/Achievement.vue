<template>
    <template v-for="level in required.length">
        <div
            class="achievement-card"
            :class="getLevelClass(level)">
            {{ name }}
            {{ badge }}
            {{ required }}
            {{ current }}
        </div>
    </template>
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
        },

        computed: {
            currentLevel() {
                let level = 0
                this.required.forEach(requirement => requirement <= this.current && level++)
                return level
            }
        },

        methods: {
            getLevelClass(index) {
                switch (index) {
                    case 1:
                        return 'base'
                    case 2:
                        return 'bronze'
                    case 3:
                        return 'silver'
                    case 4:
                        return 'gold'
                }
            }
        }
    }
</script>

<style lang="scss" scoped src="@/styles/home/achievements/item.scss"></style>